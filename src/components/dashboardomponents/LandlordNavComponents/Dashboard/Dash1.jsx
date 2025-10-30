import React, { useMemo, useState, useEffect } from "react";
import UserProfile from "../../TenantNavComponents/Dashboard/UserProfile";
import PaymentAbout from "../../TenantNavComponents/Dashboard/PaymentAbout";

const Dash1 = ({ formData, pgData }) => {
  const [paymentsWithNames, setPaymentsWithNames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract all payments from all tenants in all rooms
  const payments = useMemo(() => {
    if (!pgData || !pgData.rooms || pgData.rooms.length === 0) {
      return [];
    }
    
    const allPayments = [];
    
    pgData.rooms.forEach(room => {
      if (room.tenants && room.tenants.length > 0) {
        room.tenants.forEach(tenant => {
          if (tenant.payments && tenant.payments.length > 0) {
            tenant.payments.forEach(payment => {
              allPayments.push({
                roomId: room.roomId,
                roomType: room.roomType,
                rent: room.rent,
                tenantId: tenant.tenantId,
                month: payment.month,
                amount: payment.amount,
                paidOn: payment.paidOn,
                joinDate: tenant.joinDate,
              });
            });
          }
        });
      }
    });
    
    // Sort by payment date (newest first)
    return allPayments.sort((a, b) => new Date(b.paidOn) - new Date(a.paidOn));
  }, [pgData]);

  // Fetch tenant names for all payments using batch API
  useEffect(() => {
    const fetchTenantNames = async () => {
      if (payments.length === 0) {
        setPaymentsWithNames([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get unique tenant IDs
        const uniqueTenantIds = [...new Set(payments.map(p => p.tenantId))];
        
        // Fetch all tenant data in one batch request
        const response = await fetch('http://localhost:5000/auth/tenants-batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tenantIds: uniqueTenantIds })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tenant data');
        }

        const tenants = await response.json(); // Direct array of tenant objects
        
        // Create a map for quick lookup
        const tenantMap = tenants.tenants.reduce((acc, tenant) => {
          acc[tenant._id.toString()] = {
            firstName: tenant.firstName || '',
            lastName: tenant.lastName || '',
            phone: tenant.phone || ''
          };
          return acc;
        }, {});

        // Add names to payments
        const paymentsWithNamesData = payments.map(payment => ({
          ...payment,
          firstName: tenantMap[payment.tenantId]?.firstName || 'Unknown',
          lastName: tenantMap[payment.tenantId]?.lastName || '',
          phone: tenantMap[payment.tenantId]?.phone || ''
        }));

        setPaymentsWithNames(paymentsWithNamesData);

      } catch (error) {
        console.error("Error fetching tenant names:", error);
        // Fallback to payments without names
        const fallbackPayments = payments.map(payment => ({
          ...payment,
          firstName: 'Unknown',
          lastName: '',
          phone: ''
        }));
        setPaymentsWithNames(fallbackPayments);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantNames();
  }, [payments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading payment information...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <UserProfile formData={formData} pgData={pgData} />
      <PaymentAbout 
        formData={formData} 
        residingPG={true} 
        payments={paymentsWithNames} 
        pgData={pgData} 
      />
    </div>
  );
};

export default Dash1;
import React from 'react';
import styled from 'styled-components';

const Radio = ({ option1, option2, option3, value, onChange,name }) => {
  return (
    <StyledWrapper>
      <div className="radio-input">
        <label>
          <input
            name={name}
            type="radio"
            value={option1}
            checked={value === option1}
            onChange={() => onChange(option1)}
          />
          <span>{option1}</span>
        </label>
        <label>
          <input
            name={name}
            type="radio"
            value={option2}
            checked={value === option2}
            onChange={() => onChange(option2)}
          />
          <span>{option2}</span>
        </label>
        <label>
          <input
            name={name}
            type="radio"
            value={option3}
            checked={value === option3}
            onChange={() => onChange(option3)}
          />
          <span>{option3}</span>
        </label>
        <span className="selection" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .radio-input input {
    display: none;
  }

  .radio-input {
    --container_width: 300px;
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 10px;
    background-color: #e8e8e8;
    color: #000000;
    width: var(--container_width);
    overflow: hidden;
    border: 1px solid rgba(53, 52, 52, 0.226);
  }

  .radio-input label {
    width: 100%;
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    font-weight: 400;
    letter-spacing: -1px;
    font-size: 16px;
  }

  .selection {
    display: none;
    position: absolute;
    height: 100%;
    width: calc(var(--container_width) / 3);
    z-index: 0;
    left: 0;
    top: 0;
    transition: .15s ease;
  }

  .radio-input label:has(input:checked) {
    color: #fff;
  }

  .radio-input label:has(input:checked) ~ .selection {
    background-color: #5c5c5c;
    display: inline-block;
  }

  .radio-input label:nth-child(1):has(input:checked) ~ .selection {
    transform: translateX(calc(var(--container_width) * 0/3));
  }

  .radio-input label:nth-child(2):has(input:checked) ~ .selection {
    transform: translateX(calc(var(--container_width) * 1/3));
  }

  .radio-input label:nth-child(3):has(input:checked) ~ .selection {
    transform: translateX(calc(var(--container_width) * 2/3));
  }
`;

export default Radio;

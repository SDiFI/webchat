import styled from 'styled-components';

export const Header = styled.div`
  height: 70px;

  background-color: #135afe;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-family: sans-serif;
  position: relative;
`;

export const HeaderTitle = styled.h4`
  top: 11px;
  font-size: 20px;
  margin: 0;
  font-family: sans-serif;
  position: absolute;
  left: 20px;
  font-weight: 700;
`;

export const HeaderSubtitle = styled.span`
  bottom: 12px;
  position: absolute;
  left: 22px;
`;

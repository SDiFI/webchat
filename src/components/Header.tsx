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

export const HeaderButtonGroup = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  flex-direction: row;
  align-items: end;

  color: ${({theme}) => theme.headerFgColor};
`;

HeaderButtonGroup.defaultProps = {
    theme: {
        headerFgColor: '#000',
    },
}

export type HeaderButtonProps = {
    active?: boolean,
};

export const HeaderButton = styled.button<HeaderButtonProps>`
  background: ${props => props.active ? 'rgb(0 0 0 / 0.2)' : 'none'};
  height: 30px;
  width: 30px;
  padding: 5px;
  margin: 2px;
  display: block;
  text-align: center;
  border: none;
  border-radius: 4px;
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }

  img {
    height: 80%;
    width: 80%
  }
`;

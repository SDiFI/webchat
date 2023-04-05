import styled from 'styled-components';
import { defaultTheme } from '../theme';

const AltContainer = styled.div`
  width: 100%;
  height: 510px;
  max-height: 50vh;
  padding-top: 10px;
  padding-bottom: 74px;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
  align-items: center;
  font-family: sans-serif;
  position: relative;

  background-color: ${props => props.theme.secondaryBackground};
  color: ${props => props.theme.secondaryFontColor};

  a {
    color: inherit;
    font-weight: bold;
    text-decoration: underline !important;
    line-height: normal;
  }
`;

AltContainer.defaultProps = {
    theme: defaultTheme,
};

export default AltContainer;

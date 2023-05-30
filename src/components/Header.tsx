import styled from 'styled-components';
import { defaultTheme } from '../theme';

export const Header = styled.div`
    min-height: 34px;
    background-color: ${props => props.theme.secondaryBgColor};
    color: ${props => props.theme.secondaryFgColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    padding-top: 11px;
    padding-bottom: 11px;
`;

Header.defaultProps = {
    theme: defaultTheme,
};

export const HeaderTitle = styled.h4`
    font-size: 20px;
    margin: 0 0 0 20px;
    font-weight: 700;

    text-align: left;
    display: block;
    float: left;
`;

export const HeaderSubtitle = styled.span`
    margin: 0 0 0 20px;
`;

export const HeaderButtonGroup = styled.div`
    position: absolute;
    right: 20px;
    display: flex;
    flex-direction: row;
    align-items: end;
`;

HeaderButtonGroup.defaultProps = {
    theme: defaultTheme,
};

export type HeaderButtonProps = {
    active?: boolean;
};

export const HeaderButton = styled.button<HeaderButtonProps>`
    background: ${props => (props.active ? 'rgb(0 0 0 / 0.2)' : 'none')};
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
        width: 80%;
    }
`;

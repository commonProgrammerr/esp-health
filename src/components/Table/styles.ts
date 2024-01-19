import { darken } from 'polished';
import styled, { css } from 'styled-components';

export const Container = styled.div<{ columns: number }>`
  display: grid;
  border-radius: 4px;
  border-top: 1px solid ${({ theme }) => darken(.03, theme.default.grey_light)};
  border-left: 1px solid ${({ theme }) => darken(.03, theme.default.grey_light)};
  grid-template-columns: ${props =>
    (props.columns > 2) ?
      css`1fr repeat(${props.columns - 2}, minmax(120px, 250px)) minmax(180px, 200px)`
      : (props.columns > 1) ?
        css`1fr minmax(180px, 200px)`
        :
        css`1fr`

  };
  
  & > span:nth-child(${props => props.columns}) {
    border-top-right-radius: 4px;
  }
`;


export const Cell = styled.span`

  font-size: .75rem;
  line-height: .875rem;
  padding: 14px;
  border-right: 1px solid ${({ theme }) => darken(.03, theme.default.grey_light)};
  border-bottom: 1px solid ${({ theme }) => darken(.03, theme.default.grey_light)};
  

  strong {
    font-size: .75rem;
    line-height: .875rem;
    color: ${({ theme }) => theme.text.secondary};
  }

  &:nth-last-child(1) {
    border-bottom-right-radius: 4px;
  }
  &:nth-last-child(2) {
    border-bottom-left-radius: 4px;
  }

  .ctrl {
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-self: center;
  }
`
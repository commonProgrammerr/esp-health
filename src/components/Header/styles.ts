import styled from 'styled-components';
// import * as AvatarPrimitive from '@radix-ui/react-avatar';
// import { MdMenu } from 'react-icons/md';

export const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* background-color: ${({ theme }) => theme.background.default};
  border-bottom: 3px solid ${({ theme }) => theme.background.primary}; */
  
  
  & > img {
    /* padding: 12px 0; */
    /* padding-left: 36px; */
    /* height: 67px; */
    object-fit: cover;
  }
  
  & > div {
    display: flex;
    padding: 12px 0;
    align-items: center;
    padding-right: 42px;
    justify-content: flex-end;
    gap: 22px;
    
    & > svg {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.icons.highlight}
    }
  }
  `;

// export const Menu = styled(MdMenu)`
//   font-size: 2rem;
//   height: 100%;
//   width: calc(1em + 32px);
//   padding: 0 16px;
//   color: ${props => props.theme.icons.default};
//   cursor: pointer;
// `


// export const Avatar = styled(AvatarPrimitive.Root)`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   vertical-align: middle;
//   overflow: hidden;
//   user-select: none;
//   width: 38px;
//   height: 38px;
//   border-radius: 100%;
//   background-color: black;
  
//   `


// export const Image = styled(AvatarPrimitive.Image)`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   border-radius: inherit;
//   `

// export const Fallback = styled(AvatarPrimitive.Fallback)`
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: ${({ theme }) => theme.icons.highlight};
//   color: white;
//   font-size: 1rem;
//   font-weight: 500;
// `


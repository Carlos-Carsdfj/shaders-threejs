import styled from 'styled-components'

export const FloatPoint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transition: 0.2s all ease;
  &:hover {
    .float-point-text {
      opacity: 1;
      transition: 0.2s all ease;
    }
  }
`

export const FloatPaintLabel = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  left: -20px;
  top: -20px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  transition: 0.2s all ease;
  &:hover {
    transition: 0.2s all ease;
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.9);
  }
`

export const FloatPaintText = styled.div`
  width: 120px;
  padding: 1rem;
  position: absolute;
  top: 30px;
  left: -60px;
  background-color: rgba(0, 0, 0, 0.9);
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  transition: 0.2s all ease;
  opacity: 0;
  pointer-events: none;
`

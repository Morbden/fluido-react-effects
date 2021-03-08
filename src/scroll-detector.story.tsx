import { Meta, Story } from '@storybook/react'
import styled from 'styled-components'
import useScrollDetector, { ScrollDetectorProps } from './scroll-detector'

const ComponentMeta: Meta = {
  title: 'ScrollDetector',
}

export default ComponentMeta

const Container = styled.div`
  height: 200vh;
  width: 200vw;
  background-color: darkgray;

  & > * {
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const Template: Story<ScrollDetectorProps> = () => {
  const [scroll] = useScrollDetector()

  return (
    <Container>
      <div>
        <pre>{JSON.stringify(scroll.value, null, 2)}</pre>
      </div>
    </Container>
  )
}

export const showState = Template.bind({})

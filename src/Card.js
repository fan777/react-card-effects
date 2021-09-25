import './Card.css'

const Card = ({ image, name }) => {
  return (
    <img className='Card' src={image} alt={name}></img>
  )
}

export default Card;
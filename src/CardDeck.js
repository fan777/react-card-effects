import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Card from './Card'
import './CardDeck.css'

const API_BASE_URL = 'http://deckofcardsapi.com/api/deck'

const CardDeck = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const getDeck = async () => {
      let newDeck = await axios.get(`${API_BASE_URL}/new/shuffle`)
      setDeck(newDeck.data);
    }
    getDeck();
  }, [setDeck]);

  useEffect(() => {
    const getCard = async () => {
      let { deck_id } = deck;
      try {
        let response = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`)
        if (response.data.remaining === 0 && cards.length === 52) {
          setAutoDraw(false)
          throw new Error('no cards remaining')
        }

        let newCard = response.data.cards[0];
        setCards(c => [
          ...c,
          {
            id: newCard.code,
            name: `${newCard.value} ${newCard.suit}`,
            image: newCard.image
          }
        ])

      } catch (err) {
        alert(err)
      }
    }
    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 500)
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // getCard();
  }, [autoDraw, setAutoDraw, cards, deck])

  const handleClick = async () => {
    setAutoDraw(enable => !enable)
  };

  return (
    <div className='CardDeck'>
      {deck ? (<button onClick={handleClick}>{autoDraw ? 'STOP!!!' : 'DROP CARD!! GO!'}</button>) : null}

      <div>{cards.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
      ))}</div>
    </div>
  )
}

export default CardDeck;
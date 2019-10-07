import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Container, Label } from './styles';

export default function Card({ data, index }) {
  const ref = useRef();

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      // console.log(item.index, index);
      const draggetIndex = item.index;
      const targetIndex = index;

      if (draggetIndex === targetIndex) {
        return;
      }
      // pega posicao do elemento
      const targetSize = ref.current.getBoundingClientRect();
      // console.log(targetSize);
      // pega a metade da posicao do elemento
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;
      //  console.log(targetCenter);
      // valor do item arrastado
      const draggetOffset = monitor.getClientOffset();
      // console.log(draggetOffset);
      // pegando as posicoes dos dois cards a serem alterados
      const draggedTop = draggetOffset.y - targetSize.top;
      // console.log(draggedTop, targetCenter);
      // se arrastar um card e ainda estiver antes da metade e/ou inicio do outro card não faca nada
      if (draggetIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }
      // console.log('passou da metade do card');
      // se arrastar um card de baixo pra cima e ainda não chegou na metade da posicao do card, não faca nda
      if (draggetIndex < targetIndex && draggedTop > targetCenter) {
        return;
      }
    },
  });

  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => (
          <Label key={label} color={label} />
        ))}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt={data.user} />}
    </Container>
  );
}

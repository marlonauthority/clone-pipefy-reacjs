import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import BoardContext from '../Board/context';

import { Container, Label } from './styles';

export default function Card({ data, index, listIndex }) {
  const ref = useRef();

  const { move } = useContext(BoardContext);

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, listIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      // console.log(item.index, index);
      const draggetIndex = item.index;
      const targetIndex = index;

      if (
        draggetIndex === targetIndex &&
        draggedListIndex === targetListIndex
      ) {
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
      // faz a movimentacao
      move(draggedListIndex, targetListIndex, draggetIndex, targetIndex);
      // apos o card ser movido de lugar o outro card precisa saber que teve sua posicao(index) alterada
      item.index = targetIndex;
      item.listIndex = targetListIndex;
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

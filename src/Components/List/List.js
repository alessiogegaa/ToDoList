import React from 'react'
import './List.css'
import Button from '../Button/Button'

const List = ({text, editTask, deleteTask}) => {
  return (
    <div className='list'>
       <p>{text}</p>
       <div className='buttons'>
       <Button text="Edit" type='secondary' onClick={editTask}/>
       <Button text="Delete" type='tertiary' onClick={deleteTask}/>
       </div>
    </div>
  )
}

export default List;

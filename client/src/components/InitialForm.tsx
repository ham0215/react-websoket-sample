import React, { ReactHTML, ReactEventHandler } from 'react'

interface Props {
  inputtedValue: string;
  changeHandler: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  submitHandler: (e: React.MouseEvent) => void;
}

export const InitialForm = (
  { inputtedValue, changeHandler, submitHandler }: Props
) => {
  return (
    <div>
      user name:
      <input type="text" value={inputtedValue} onChange={changeHandler} />
      <button onClick={submitHandler}>join</button>
    </div>
  )
}
import { ShoppingItem } from '@prisma/client';
import {Dispatch, FC, SetStateAction, useState} from 'react';
import { trpc } from '../utils/trpc';

interface ItemModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>
  setItems: Dispatch<SetStateAction<ShoppingItem[]>>
}

export const ItemModal: FC<ItemModalProps> = ({setModalOpen, setItems}) => {
  const [input, setInput] = useState<string>("")

  const {mutate: addItem} = trpc.useMutation(["items.addItem"], {
    onSuccess(shoppingItem) {
      setItems((prev) => [...prev, shoppingItem])
    },
  })

  return (
    <div className='absolute inset-0 bg-black/75 flex items-center justify-center'>
      <div className='space-y-4 p-3 bg-white'>
        <h3 className='text-xl font-semibold'>Name of Item</h3>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='w-full bg-gray-200 border-gray-300 shadow-sm focus:border-violet-300 rounded-md' />
        <div className='grid grid-cols-2 gap-8'>
          <button
            onClick={() => setModalOpen(false)}
            type='button'
            className='bg-gray-300 text-xs rounded-md p-1 text-white transition hover:bg-gray-400'>
            Cancel
          </button>
          <button
            onClick={() => {
              addItem({name: input})
              setModalOpen(false)
            }}
            type='button'
            className='bg-violet-500 text-xs rounded-md p-1 text-white transition hover:bg-violet-700'>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
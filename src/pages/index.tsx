import { ShoppingItem } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import {ItemModal} from "../components/ItemModal";
import { trpc } from "../utils/trpc";
import {HiX} from "react-icons/hi";
import {motion} from 'framer-motion';

const Home: NextPage = () => {
  // const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [checkedItems, setCheckedItems] = useState<ShoppingItem[]>([])
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const {data: itemsData, isLoading} = trpc.useQuery(["items.getAllItems"],{
    onSuccess(shoppingItems) {
      setItems(shoppingItems),
      setCheckedItems(shoppingItems.filter(item => item.checked))
    },
  })

  const {mutate: deleteItem} = trpc.useMutation(["items.deleteItem"], {
    onSuccess(shoppingItem) {
      setItems((prev) => prev.filter((item) => item.id !== shoppingItem.id))
    },
  })

  const {mutate: toogleChecked} = trpc.useMutation(["items.toogleChecked"], {
    onSuccess(shoppingItem) {
      // check if item is already checked
      if(checkedItems.some(item => item.id === shoppingItem.id)) {
        // remove item from checkedItems
        setCheckedItems((prev) => prev.filter((item) => item.id !== shoppingItem.id))
      } else {
        // add item to checkedItems
        setCheckedItems((prev) => [...prev, shoppingItem])
      }
    }
  })

  if (!itemsData || isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {modalOpen && <ItemModal setModalOpen={setModalOpen} setItems={setItems}/>}

      <main className="mx-auto my-12 max-w-3xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">My Shopping List</h2>
          <button
            onClick={() => setModalOpen(true)}
            type="button" 
            className="bg-violet-500 text-sm rounded-md p-2 text-white transition hover:bg-violet-700" > 
            Add shopping item
          </button>
        </div>
        <ul className="mt-4">
          {items.map((item) => {
            const {id, name} = item
            return (
              <li key={id} className="flex w-full justify-between items-center">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 flex origin-left items-center justify-center">
                    <motion.div
                      initial={{width: 0}}
                      animate={{width: checkedItems.some(item => item.id === id) ? "100%" : 0}}
                      transition={{duration: 0.2, ease: "easeInOut"}}
                      className="h-[2px] w-full translate-y-px bg-red-500" 
                    />
                  </div>
                  <span 
                    onClick={()=> 
                      toogleChecked({
                        id, 
                        checked: checkedItems.some((item) => item.id ===id) ? false : true,
                      })
                    }>
                      {name}
                  </span>
                </div>
                <HiX 
                  onClick={() => deleteItem({id})}
                  className="text-right text-red-500 cursor-pointer"
                />
              </li>
            )
          })}
        </ul>
      </main>
    </>
  );
};

export default Home;

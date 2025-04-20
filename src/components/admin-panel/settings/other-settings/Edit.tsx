import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import EditFormSettings from './edit-form-settings'

interface Props {
  setting: Setting;
  dictionary:DictionaryType
}

const Edit = ({setting, dictionary}:Props) => {

  const [isOpen, setIsOpen] = useState(false)
  const closeDialog = () => setIsOpen(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger >
            <div className={` hover:cursor-pointer hover:opacity-55 `}>
              <Pencil width={20} color={"#1fc3ff"} className=" m-auto" />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{"Editer les informations "}</DialogTitle>
            </DialogHeader>
            <EditFormSettings setting={setting} dictionary={dictionary} setIsOpen={closeDialog} />
          </DialogContent>
        </Dialog>
  )
}

export default Edit
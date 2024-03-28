import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { init } from 'emoji-mart'
import i18n from '@emoji-mart/data/i18n/fr.json'

import {useEffect} from "react";
type props={
    onSelectedEmoji:(emoji:any)=>void
    close:()=>void
    isVisible:boolean
}
export const EmojiPicker=({onSelectedEmoji, close, isVisible}:props)=> {
    useEffect(() => {
        init({ data: data })
    },[]);

    return (
        <div
            style={{
                display: isVisible ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
                //position: 'absolute',
                width:"100%", height:"100%", zIndex: 2,
                
            }}
        >
            <Picker data={data} onEmojiSelect={onSelectedEmoji} searchPosition={'static'} onClickOutside={close}
                    locale={'es'} i18n={i18n} theme='light'
                    previewPosition={'none'}
                    icons={ 'solid'}
            />
        </div>
    )
}
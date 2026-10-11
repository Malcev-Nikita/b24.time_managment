'use client'

import { useState } from "react"
import { Provider } from "react-redux"
import { makeStore } from "./store"

export default function StoreProvider({ filterId, children }) {
    // Ленивая инициализация: стор создаётся один раз на клиентский рендер.
    // Период из адреса кладём сразу, чтобы не грузить сначала «Сегодня»
    const [store] = useState(() => makeStore(filterId ? { filter: { filterId } } : undefined))

    return (
        <Provider store={store}>{children}</Provider>
    )
}

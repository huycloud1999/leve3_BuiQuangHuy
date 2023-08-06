import React from 'react'
import styles from './MainContent.module.css'
import { BrowserRouter, Outlet, Route } from 'react-router-dom'

function MainContent() {
  return (
    <div className={styles['maincontent']}>
        <Outlet></Outlet>
    </div>
  )
}

export default MainContent
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="layout">
      <header>
        <h1>Piano Book - 관리자</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 
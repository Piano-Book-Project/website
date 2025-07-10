import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="layout">
      <header>
        <h1>Piano Book - 클라이언트</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 
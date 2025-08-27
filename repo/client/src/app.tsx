import { Route, Router } from "preact-router"
import LoginPage from "./pages/login.page"
import RegisterUrl from "./pages/registerUrl.component"
import AnalyzePage from "./pages/analyze"
export function App() {

  return (
    <Router>
      <Route path="/" component={RegisterUrl} />
      <Route path="/login" component={LoginPage} />
      <Route path="/analyze" component={AnalyzePage} />
    </Router>
  )

}

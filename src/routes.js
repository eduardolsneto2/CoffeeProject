import Login from './components/Login/Login.vue'
import SignUp from './components/SignUp/SignUp.vue'
import Presence from './components/Presence/Presence.vue'
import Paid from './components/Paid/Paid.vue'
import AddPaid from './components/AddPaid/AddPaid.vue'
import ShareFood from './components/ShareFood/ShareFood.vue'



export const routes = [
    
    { path: '', component: Login },
    { path: '/Cadastro', component: SignUp },
    { path: '/Presenca', component: Presence },
    { path: '/Pago', component: Paid },
    { path: '/AdicionarPagamento', component: AddPaid },
    { path: '/compartilhar', component: ShareFood }
  ];
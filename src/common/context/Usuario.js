import {createContext, useState} from 'react';

export const UsuarioContext = createContext();

const UsuarioProvider = ({ children }) => {
    const[nome, setNome] = useState("");
    const[saldo, setSaldo] = useState(0);
    return ( 
        <UsuarioProvider value={{ nome, setNome, saldo, setSaldo }}>
            {children}
        </UsuarioProvider>
     );
}
 
export default UsuarioProvider;

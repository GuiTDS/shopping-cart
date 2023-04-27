import { createContext, useContext, useEffect, useState } from 'react';
import { usePagamentoContext } from './Pagamento';
import { UsuarioContext } from './Usuario';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho,
        setValorTotalCarrinho
        }}
      >
      {children}
    </CarrinhoContext.Provider>
  )
};

export const useCarrinhoContext = () => {
  const {
    carrinho, 
    setCarrinho,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    setValorTotalCarrinho
  } = useContext(CarrinhoContext);

  const { formaPagamento } = usePagamentoContext();

  const { setSaldo } = useContext(UsuarioContext);

  function mudarQuantidade(id, quantidade) {
    return carrinho.map(itemDoCarrinho => {
      if(itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade;
      return itemDoCarrinho;
    })
  }

  function adicionarProduto(novoProduto) {
    const temOProduto = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id);
    if(!temOProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho(carrinhoAnterior =>
        [...carrinhoAnterior, novoProduto]
      )
    }
    setCarrinho(mudarQuantidade(novoProduto.id, 1));
  }

  function removerProduto(id) {
    const produto = carrinho.find(itemDoCarrinho => itemDoCarrinho.id === id);
    const ehOUltimo = produto.quantidade === 1;
    if(ehOUltimo) {
      return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemDoCarrinho => itemDoCarrinho.id !== id));
    }
    setCarrinho(mudarQuantidade(id, -1));
  }

  function efetuarCompra() {
    setCarrinho([]);
    setSaldo(saldoAtual => saldoAtual - valorTotalCarrinho);
  }

  useEffect(() => {
    const { novoTotal, novaQuantidade } = carrinho.reduce((contador,
       produto) => ({
        novaQuantidade: contador.novaQuantidade + produto.quantidade,
        novoTotal: contador.novoTotal + (produto.valor * produto.quantidade)
       }), {
        novaQuantidade: 0,
        novoTotal: 0
       });
    setQuantidadeProdutos(novaQuantidade);
    setValorTotalCarrinho(novoTotal * formaPagamento.juros);
  }
  , [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento]);

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    efetuarCompra
  }
}
 

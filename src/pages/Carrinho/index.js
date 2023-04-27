import { Button, Snackbar, InputLabel, Select, MenuItem } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useContext, useMemo, useState } from 'react';
import { Container, Voltar, TotalContainer, PagamentoContainer } from './styles';
import { useCarrinhoContext } from 'common/context/Carrinho';
import Produto from 'components/Produto';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { usePagamentoContext } from 'common/context/Pagamento';
import { UsuarioContext } from 'common/context/Usuario';

function Carrinho() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { carrinho, valorTotalCarrinho, efetuarCompra } = useCarrinhoContext();
  const { saldo = 0.00 } = useContext(UsuarioContext);
  const { tiposPagamento, formaPagamento, mudarFormaPagamento } = usePagamentoContext();
  const total = useMemo(() => saldo - valorTotalCarrinho,[saldo, valorTotalCarrinho]); // para evitar renderizações toda vez
  //que o carrinho for renderizado. Só irá calcular o valor total caso haja alteração no saldo ou no valorTotalCarrinho;


  const history = useHistory();
  return (
    <Container>
      <Voltar onClick={() => history.goBack()}/>
      <h2>
        Carrinho
      </h2>
      {carrinho.map(produto => {
        return (<Produto
          {...produto}
          key={produto.id}
        />
        )
      })}
      <PagamentoContainer>
        <InputLabel> Forma de Pagamento </InputLabel>
        <Select
        value={formaPagamento.id}
        onChange={(event) => mudarFormaPagamento(event.target.value)}
        >
          {tiposPagamento.map(pagamento => {
            return(
              <MenuItem value={pagamento.id} key={pagamento.id}>
                {pagamento.nome}
              </MenuItem>
            )
          })}
        </Select>
      </PagamentoContainer>
      <TotalContainer>
        <div>
          <h2>Total no Carrinho: </h2>
          <span>R${valorTotalCarrinho.toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo: </h2>
          <span> R${Number(saldo).toFixed(2)} </span>
        </div>
        <div>
          <h2> Saldo Total: </h2>
          <span> R${total.toFixed(2)} </span>
        </div>
      </TotalContainer>
      <Button
        disabled = {total < 0 || carrinho.length === 0}
        onClick={() => {
          efetuarCompra();
          setOpenSnackbar(true);
        }}
        color="primary"
        variant="contained"
      >
        Comprar
      </Button>
      <Snackbar
        anchorOrigin={
          {
            vertical: 'top',
            horizontal: 'right'
          }
        }
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
        >
          Compra feita com sucesso!
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default Carrinho;
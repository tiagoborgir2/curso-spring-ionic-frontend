import { ItemPedidoDTO } from './item_pedido.dto';
import { PagamentoDTO } from './pagamento.dto';
import { RefDTO } from './ref.dto';

export interface PedidoDTO {
  cliente : RefDTO;
  enderecoDeEntrega : RefDTO;
  pagamento : PagamentoDTO;
  itens : ItemPedidoDTO[];
}

"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"
import { ShoppingCart, Plus, Trash2 } from "lucide-react"

type Produto = {
  id: string
  nome: string
  preco: number
  estoque: number
}

type Servico = {
  id: string
  nome: string
  valor: number
}

export default function VendasPage() {

  const [empresaId,setEmpresaId] = useState<string | null>(null)

  const [produtos,setProdutos] = useState<Produto[]>([])
  const [servicos,setServicos] = useState<Servico[]>([])

  const [tipo,setTipo] = useState("produto")
  const [itemId,setItemId] = useState("")
  const [quantidade,setQuantidade] = useState("1")

  const [itens,setItens] = useState<any[]>([])
  const [msg,setMsg] = useState("")

  async function carregarEmpresa(){

    const user = await getUser()
    if(!user) return

    const {data} = await supabase
      .from("empresas")
      .select("id")
      .eq("user_id",user.id)
      .single()

    if(data){
      setEmpresaId(data.id)
      carregar(data.id)
    }

  }

  async function carregar(id:string){

    const {data:p} = await supabase
      .from("produtos")
      .select("*")
      .eq("empresa_id",id)

    const {data:s} = await supabase
      .from("servicos")
      .select("*")
      .eq("empresa_id",id)

    if(p) setProdutos(p)
    if(s) setServicos(s)

  }

  function adicionarItem(){

    if(!itemId) return

    const itemSelecionado =
      tipo === "produto"
        ? produtos.find(p=>p.id===itemId)
        : servicos.find(s=>s.id===itemId)

    if(!itemSelecionado) return

    const qtd = Number(quantidade)

    if(tipo==="produto"){
      const produto = itemSelecionado as Produto

      if(produto.estoque < qtd){
        setMsg("Estoque insuficiente")
        return
      }
    }

    const valorUnitario =
      tipo==="produto"
        ? (itemSelecionado as Produto).preco
        : (itemSelecionado as Servico).valor

    const novo = {
      tipo,
      item_id:itemSelecionado.id,
      nome:itemSelecionado.nome,
      quantidade:qtd,
      valor_unitario:valorUnitario,
      subtotal:qtd*valorUnitario
    }

    setItens([...itens,novo])

    setItemId("")
    setQuantidade("1")

  }

  function removerItem(index:number){
    const novaLista = [...itens]
    novaLista.splice(index,1)
    setItens(novaLista)
  }

  async function salvarVenda(){

    if(!empresaId) return

    if(itens.length===0){
      setMsg("Adicione ao menos um item")
      return
    }

    const total = itens.reduce((acc,i)=>acc+i.subtotal,0)

    const {data:venda,error} = await supabase
      .from("vendas")
      .insert([{total,empresa_id:empresaId}])
      .select("id")
      .single()

    if(error || !venda){
      setMsg(error?.message || "Erro venda")
      return
    }

    for(const i of itens){

      await supabase
        .from("venda_itens")
        .insert([{...i,venda_id:venda.id,empresa_id:empresaId}])

      if(i.tipo==="produto"){

        const produto = produtos.find(p=>p.id===i.item_id)

        if(produto){

          await supabase
            .from("produtos")
            .update({
              estoque:produto.estoque - i.quantidade
            })
            .eq("id",produto.id)

        }

      }

    }

    await supabase
      .from("financeiro")
      .insert([{
        valor:total,
        tipo:"entrada",
        empresa_id:empresaId
      }])

    setItens([])
    setMsg("Venda finalizada com sucesso")

  }

  useEffect(()=>{
    carregarEmpresa()
  },[])

  const total = itens.reduce((acc,i)=>acc+i.subtotal,0)

  return(

  <div className="space-y-10">

    {/* HEADER */}

    <div>

      <h1 className="text-3xl font-bold">
        Nova Venda
      </h1>

      <p className="text-zinc-400">
        Registre vendas de produtos ou serviços
      </p>

    </div>


    {/* FORM */}

    <div className="card-alpha space-y-4">

      <div className="grid md:grid-cols-3 gap-4">

        <select
          value={tipo}
          onChange={(e)=>setTipo(e.target.value)}
          className="input"
        >

          <option value="produto">Produto</option>
          <option value="servico">Serviço</option>

        </select>

        <select
          value={itemId}
          onChange={(e)=>setItemId(e.target.value)}
          className="input"
        >

          <option value="">Selecione</option>

          {tipo==="produto" && produtos.map(p=>(
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}

          {tipo==="servico" && servicos.map(s=>(
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}

        </select>

        <input
          type="number"
          value={quantidade}
          onChange={(e)=>setQuantidade(e.target.value)}
          className="input"
        />

      </div>

      <button
        onClick={adicionarItem}
        className="btn-primary flex items-center gap-2"
      >
        <Plus size={16}/>
        Adicionar Item
      </button>

    </div>


    {/* CARRINHO */}

    <div className="card-alpha space-y-4">

      <div className="flex items-center gap-2">

        <ShoppingCart size={18}/>

        <h2 className="font-semibold">
          Itens da Venda
        </h2>

      </div>

      {itens.length===0 &&(

        <p className="text-zinc-400 text-sm">
          Nenhum item adicionado
        </p>

      )}

      {itens.map((i,index)=>(

        <div
          key={index}
          className="flex justify-between items-center bg-zinc-900 p-3 rounded"
        >

          <div>

            <p className="font-medium">
              {i.nome}
            </p>

            <p className="text-sm text-zinc-400">
              {i.quantidade} x R$ {i.valor_unitario}
            </p>

          </div>

          <div className="flex items-center gap-3">

            <span className="text-blue-400 font-semibold">
              R$ {i.subtotal.toFixed(2)}
            </span>

            <button
              onClick={()=>removerItem(index)}
              className="btn-danger"
            >
              <Trash2 size={14}/>
            </button>

          </div>

        </div>

      ))}

    </div>


    {/* TOTAL */}

    <div className="card-alpha flex justify-between items-center">

      <p className="text-lg font-semibold">
        Total
      </p>

      <p className="text-2xl font-bold text-blue-400">
        R$ {total.toFixed(2)}
      </p>

    </div>


    <button
      onClick={salvarVenda}
      className="btn-primary text-lg"
    >
      Finalizar Venda
    </button>


    {msg &&(

      <div className="card-alpha text-sm text-zinc-300">
        {msg}
      </div>

    )}

  </div>

)

}
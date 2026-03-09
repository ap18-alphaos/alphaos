"use client"

import { useEffect, useState } from "react"
import { supabase, getUser } from "@/lib/supabase"
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertTriangle
} from "lucide-react"

type Produto = {
  id: string
  nome: string
  categoria: string
  preco: number
  custo: number
  estoque: number
  estoque_minimo: number
}

export default function ProdutosPage(){

  const [produtos,setProdutos] = useState<Produto[]>([])
  const [empresaId,setEmpresaId] = useState<string | null>(null)

  const [nome,setNome] = useState("")
  const [categoria,setCategoria] = useState("")
  const [preco,setPreco] = useState("")
  const [custo,setCusto] = useState("")
  const [estoque,setEstoque] = useState("")
  const [estoqueMinimo,setEstoqueMinimo] = useState("")

  const [busca,setBusca] = useState("")

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
      carregarProdutos(data.id)
    }

  }

  async function carregarProdutos(id:string){

    const {data} = await supabase
      .from("produtos")
      .select("*")
      .eq("empresa_id",id)
      .order("nome")

    if(data) setProdutos(data)

  }

  async function salvar(){

    if(!empresaId) return

    await supabase
      .from("produtos")
      .insert([{
        nome,
        categoria,
        preco:Number(preco),
        custo:Number(custo),
        estoque:Number(estoque),
        estoque_minimo:Number(estoqueMinimo),
        empresa_id:empresaId
      }])

    setNome("")
    setCategoria("")
    setPreco("")
    setCusto("")
    setEstoque("")
    setEstoqueMinimo("")

    carregarProdutos(empresaId)

  }

  async function excluir(id:string){

    if(!confirm("Excluir produto?")) return

    await supabase
      .from("produtos")
      .delete()
      .eq("id",id)

    if(empresaId) carregarProdutos(empresaId)

  }

  useEffect(()=>{
    carregarEmpresa()
  },[])

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const estoqueBaixo =
    produtos.filter(p=>p.estoque <= p.estoque_minimo)

  const valorEstoque =
    produtos.reduce((acc,p)=>acc + (p.preco*p.estoque),0)

  return(

  <div className="space-y-10">

    {/* HEADER */}

    <div>

      <h1 className="text-3xl font-bold">
        Produtos
      </h1>

      <p className="text-zinc-400">
        Gerencie peças e controle de estoque
      </p>

    </div>


    {/* MÉTRICAS */}

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <Metric titulo="Produtos" valor={produtos.length} />

      <Metric titulo="Estoque baixo" valor={estoqueBaixo.length} />

      <Metric titulo="Valor em estoque" valor={`R$ ${valorEstoque.toFixed(2)}`} />

      <Metric titulo="Categorias"
        valor={[...new Set(produtos.map(p=>p.categoria))].length}
      />

    </div>


    {/* BUSCA */}

    <div className="card-alpha flex items-center gap-3">

      <Search size={18}/>

      <input
        placeholder="Buscar produto..."
        value={busca}
        onChange={e=>setBusca(e.target.value)}
        className="input bg-transparent border-none"
      />

    </div>


    {/* FORMULÁRIO */}

    <div className="card-alpha space-y-6">

      <h2 className="flex items-center gap-2 font-semibold text-lg">
        <Plus size={18}/>
        Novo Produto
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        <input
          placeholder="Nome"
          value={nome}
          onChange={e=>setNome(e.target.value)}
          className="input"
        />

        <input
          placeholder="Categoria"
          value={categoria}
          onChange={e=>setCategoria(e.target.value)}
          className="input"
        />

        <input
          placeholder="Preço"
          value={preco}
          onChange={e=>setPreco(e.target.value)}
          className="input"
        />

        <input
          placeholder="Custo"
          value={custo}
          onChange={e=>setCusto(e.target.value)}
          className="input"
        />

        <input
          placeholder="Estoque"
          value={estoque}
          onChange={e=>setEstoque(e.target.value)}
          className="input"
        />

        <input
          placeholder="Estoque mínimo"
          value={estoqueMinimo}
          onChange={e=>setEstoqueMinimo(e.target.value)}
          className="input"
        />

      </div>

      <button
        onClick={salvar}
        className="btn-primary w-fit"
      >
        Salvar Produto
      </button>

    </div>


    {/* LISTA PRODUTOS */}

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {filtrados.map(produto=>{

        const baixo = produto.estoque <= produto.estoque_minimo

        return(

        <div
          key={produto.id}
          className="card-alpha space-y-4"
        >

          <div className="flex items-center gap-2">

            <Package size={18}/>

            <p className="font-semibold text-lg">
              {produto.nome}
            </p>

          </div>

          <p className="text-zinc-400 text-sm">
            {produto.categoria}
          </p>

          <div className="flex justify-between text-sm">

            <p>
              Preço
              <br/>
              <span className="text-blue-400 font-semibold">
                R$ {produto.preco}
              </span>
            </p>

            <p className={baixo ? "text-red-400" : "text-zinc-300"}>

              Estoque
              <br/>

              {produto.estoque}

              {baixo && (
                <span className="flex items-center gap-1 text-xs mt-1">
                  <AlertTriangle size={12}/>
                  baixo
                </span>
              )}

            </p>

          </div>

          <div className="flex gap-2 pt-2">

            <button className="btn">
              <Pencil size={16}/>
            </button>

            <button
              onClick={()=>excluir(produto.id)}
              className="btn-danger"
            >
              <Trash2 size={16}/>
            </button>

          </div>

        </div>

        )

      })}

    </div>

  </div>

)

}

function Metric({titulo,valor}:any){

  return(

    <div className="card-alpha">

      <p className="text-zinc-400 text-sm">
        {titulo}
      </p>

      <p className="text-2xl font-bold text-blue-400 mt-1">
        {valor}
      </p>

    </div>

  )

}
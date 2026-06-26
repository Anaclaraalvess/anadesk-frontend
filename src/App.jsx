import React, { useState, useEffect } from 'react';
import { 
  Terminal, User, Lock, CheckCircle, LogOut, RefreshCw, 
  Send, Loader2, Search, ShieldCheck, Trash2, ShieldAlert, PlusSquare 
} from 'lucide-react';

// Aqui nós conectamos com a sua API do Back-end!
const API_URL = 'https://anadesk-backend.onrender.com';

export default function App() {
  const [chamados, setChamados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      carregarChamados();
    }
  }, [user]);

  const fazerLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (email.includes('tecnico')) {
        setUser({ id: '2', nome: 'Analista SOC', perfil: 'TECNICO', email });
      } else {
        setUser({ id: '1', nome: 'Funcionário Padrão', perfil: 'PADRAO', email });
      }
      setIsDemoMode(true);
      setIsLoading(false);
    }, 1000);
  };

  const carregarChamados = async () => {
    setIsLoading(true);
    if (isDemoMode) {
      setTimeout(() => {
        setChamados([
          { id: '1', titulo: 'Alerta de Phishing', descricao: 'E-mail suspeito recebido pelo RH.', status: 'ABERTO', data_criacao: new Date().toISOString(), autor: { nome: 'Maria (RH)' } },
          { id: '2', titulo: 'Ransomware Detectado', descricao: 'Estação 45 relatou lentidão severa e arquivos criptografados.', status: 'EM_ANDAMENTO', data_criacao: new Date().toISOString(), autor: { nome: 'Sistema EDR' } }
        ]);
        setIsLoading(false);
      }, 800);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/chamados`);
      const data = await res.json();
      setChamados(data);
    } catch (error) {
      console.warn("API offline, ativando Demo Mode");
      setIsDemoMode(true);
    }
    setIsLoading(false);
  };

  const criarChamado = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (isDemoMode) {
      setTimeout(() => {
        const novo = {
          id: Math.random().toString(),
          titulo: novoTitulo,
          descricao: novaDescricao,
          status: 'ABERTO',
          data_criacao: new Date().toISOString(),
          autor: { nome: user.nome }
        };
        setChamados([novo, ...chamados]);
        setNovoTitulo('');
        setNovaDescricao('');
        setIsSubmitting(false);
      }, 800);
      return;
    }

    try {
      await fetch(`${API_URL}/chamados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao, usuario_id: user.id })
      });
      setNovoTitulo('');
      setNovaDescricao('');
      carregarChamados();
    } catch (erro) {
      console.error(erro);
    } finally {
      setIsSubmitting(false);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    if (isDemoMode) {
      setChamados(chamados.map(c => c.id === id ? { ...c, status: novoStatus } : c));
      return;
    }
    try {
      await fetch(`${API_URL}/chamados/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });
      carregarChamados();
    } catch (erro) {
      console.error(erro);
    }
  };

  const deletarChamado = async (id) => {
    if (isDemoMode) {
      setChamados(chamados.filter(c => c.id !== id));
      return;
    }
    try {
      await fetch(`${API_URL}/chamados/${id}`, { method: 'DELETE' });
      carregarChamados();
    } catch (erro) {
      console.error("Erro ao deletar:", erro);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans text-slate-300">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4 border border-emerald-500/20">
              <ShieldAlert className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AnaDesk SOC</h1>
            <p className="text-sm text-slate-500 mt-2">Security Operations Center</p>
          </div>

          <div className="bg-[#111111] p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <form onSubmit={fazerLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">E-mail Corporativo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-800 rounded-lg bg-[#0a0a0a] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="nome@empresa.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Senha de Acesso</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-600" />
                  </div>
                  <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-800 rounded-lg bg-[#0a0a0a] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#0a0a0a] bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Autenticar'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="bg-emerald-500/5 rounded-lg p-4 border border-emerald-500/10">
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4"/> Acesso para Avaliação
                </h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p className="flex justify-between">
                    <span>Perfil <strong>SOC (Técnico)</strong>:</span>
                    <code className="bg-[#0a0a0a] px-2 py-0.5 rounded text-emerald-300">tecnico@anadesk.com</code>
                  </p>
                  <p className="flex justify-between">
                    <span>Perfil <strong>Padrão</strong>:</span>
                    <code className="bg-[#0a0a0a] px-2 py-0.5 rounded text-slate-300">padrao@empresa.com</code>
                  </p>
                  <p className="text-xs text-slate-500 mt-2 italic">* Use qualquer senha fictícia para entrar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans selection:bg-emerald-500/30">
      <header className="bg-[#111111] border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <ShieldAlert className="w-5 h-5 text-emerald-500" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">AnaDesk <span className="text-emerald-500 font-mono text-sm ml-1 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">SOC</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm border-r border-slate-800 pr-4">
              <span className="text-slate-500">Operador:</span>
              <span className="text-emerald-400 font-mono">{user.nome}</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                {user.perfil}
              </span>
            </div>
            <button onClick={() => setUser(null)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Desconectar">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111111] rounded-xl border border-slate-800 p-6 shadow-lg">
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <PlusSquare className="w-5 h-5 text-emerald-500" /> Reportar Incidente
              </h2>
              <form onSubmit={criarChamado} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Título do Incidente</label>
                  <input type="text" required value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-200"
                    placeholder="Ex: Phishing Recebido"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Evidências / Descrição</label>
                  <textarea required rows="4" value={novaDescricao} onChange={(e) => setNovaDescricao(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-200 resize-none"
                    placeholder="Descreva o comportamento anômalo..."
                  ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Enviar Reporte</>}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-[#111111] rounded-xl border border-slate-800 shadow-lg overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-500" /> Log de Incidentes
                </h2>
                <button onClick={carregarChamados} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm bg-[#0a0a0a] px-3 py-1.5 rounded border border-slate-800">
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chamados.length === 0 && !isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                    <ShieldCheck className="w-12 h-12 text-slate-700" />
                    <p>Nenhum incidente ativo. Ambiente seguro.</p>
                  </div>
                ) : (
                  chamados.map(c => (
                    <div key={c.id} className="bg-[#0a0a0a] rounded-lg border border-slate-800 p-4 hover:border-slate-700 transition-colors flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${
                            c.status === 'RESOLVIDO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            c.status === 'EM_ANDAMENTO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-xs font-mono text-slate-500">{new Date(c.data_criacao).toLocaleString('pt-BR')}</span>
                          <span className="text-xs text-slate-500">ID: {c.id.substring(0,8)}...</span>
                        </div>
                        <h3 className="text-base font-medium text-slate-200 mb-1">{c.titulo}</h3>
                        <p className="text-sm text-slate-400 mb-3">{c.descricao}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 w-fit px-2 py-1 rounded border border-slate-800">
                          <User className="w-3 h-3" /> Reportado por: {c.autor?.nome || 'Sistema'}
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center items-stretch md:items-end gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-4 min-w-[140px]">
                        {user.perfil === 'TECNICO' ? (
                          <>
                            {c.status === 'ABERTO' && (
                              <button onClick={() => atualizarStatus(c.id, 'EM_ANDAMENTO')} className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded flex justify-center items-center gap-2 transition-colors">
                                <Search className="w-4 h-4"/> Investigar
                              </button>
                            )}
                            
                            {c.status !== 'RESOLVIDO' && (
                              <button onClick={() => atualizarStatus(c.id, 'RESOLVIDO')} className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded flex justify-center items-center gap-2 transition-colors">
                                <CheckCircle className="w-4 h-4"/> Mitigar
                              </button>
                            )}

                            {c.status === 'RESOLVIDO' && <span className="text-xs text-emerald-500 py-2 font-mono flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Mitigado</span>}
                            
                            <div className="flex gap-2 mt-1 w-full">
                              <button onClick={() => deletarChamado(c.id)} className="w-full text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-2 rounded flex justify-center items-center gap-1 transition-colors">
                                <Trash2 className="w-4 h-4"/> Apagar Incidente
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center gap-2">
                            <span className="text-xs text-slate-500 text-center flex items-center gap-1"><Lock className="w-3 h-3"/> Acesso restrito (SOC)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #374151; }
      `}} />
    </div>
  );
}
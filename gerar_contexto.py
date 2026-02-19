import os

# --- CONFIGURAÇÕES ---
NOME_ARQUIVO_SAIDA = "code.md"

# Pastas que serão IGNORADAS (Não queremos ler isso, economiza tokens e tempo)
PASTAS_IGNORADAS = {
    'node_modules', 
    '.next', 
    '.git', 
    '.vscode', 
    '.idea', 
    'dist', 
    'build', 
    'coverage',
    '.firebase',
    '.agent',
    'reference',
    'out'
}

# Arquivos específicos para ignorar (travas de pacote, imagens, etc)
ARQUIVOS_IGNORADOS = {
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.DS_Store',
    'favicon.ico',
    '.env',        # Segurança: nunca envie env vars reais
    '.env.local'
}

# Extensões que queremos ler (adicione mais se precisar)
EXTENSOES_PERMITIDAS = {
    '.ts', '.tsx', '.js', '.jsx', 
    '.css', '.scss', '.sass', '.html', 
    '.json', '.md', '.txt', '.prisma', 
    '.sql', '.yaml', '.yml'
}

def gerar_contexto():
    caminho_raiz = os.getcwd()
    arquivo_saida = os.path.join(caminho_raiz, NOME_ARQUIVO_SAIDA)
    
    print(f"🚀 Iniciando varredura em: {caminho_raiz}")
    print(f"🚫 Ignorando pastas: {', '.join(PASTAS_IGNORADAS)}")
    
    total_arquivos = 0
    
    with open(arquivo_saida, 'w', encoding='utf-8') as f_out:
        # Escreve um cabeçalho para o Gemini entender o contexto
        f_out.write(f"# CONTEXTO DO PROJETO: {os.path.basename(caminho_raiz)}\n")
        f_out.write("Abaixo estão os conteúdos dos arquivos do projeto concatenados.\n")
        f_out.write("Cada arquivo inicia com '--- ARQUIVO: <caminho> ---'.\n\n")

        # Caminha por todas as pastas
        for raiz, dirs, files in os.walk(caminho_raiz):
            # Remove pastas ignoradas da lista de navegação
            dirs[:] = [d for d in dirs if d not in PASTAS_IGNORADAS]
            
            for arquivo in files:
                if arquivo in ARQUIVOS_IGNORADOS:
                    continue
                    
                # Verifica extensão
                _, ext = os.path.splitext(arquivo)
                if ext.lower() not in EXTENSOES_PERMITIDAS:
                    continue

                # Evita ler o próprio script ou o arquivo de saída
                if arquivo == 'gerar_contexto.py' or arquivo == NOME_ARQUIVO_SAIDA:
                    continue
                
                caminho_completo = os.path.join(raiz, arquivo)
                caminho_relativo = os.path.relpath(caminho_completo, caminho_raiz)
                
                try:
                    with open(caminho_completo, 'r', encoding='utf-8', errors='ignore') as f_in:
                        conteudo = f_in.read()
                        
                        # Formatação para o LLM
                        f_out.write(f"\n{'='*50}\n")
                        f_out.write(f"--- ARQUIVO: {caminho_relativo} ---\n")
                        f_out.write(f"{'='*50}\n")
                        f_out.write(conteudo)
                        f_out.write("\n")
                        
                        total_arquivos += 1
                        print(f"✅ Adicionado: {caminho_relativo}")
                except Exception as e:
                    print(f"❌ Erro ao ler {caminho_relativo}: {e}")

    print(f"\n🏁 Concluído! {total_arquivos} arquivos foram consolidados.")
    print(f"📄 Arquivo gerado: {NOME_ARQUIVO_SAIDA}")
    print("👉 Agora basta arrastar este arquivo único para o Gemini.")

if __name__ == "__main__":
    gerar_contexto()
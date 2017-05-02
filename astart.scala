

	ABERTOS
	FECHADOS

	adiciona o "start node" em ABERTOS

	loop
		"noAtual" = nó em ABERTOS com menor custo F 
		remove "noAtual" de ABERTOS
		adiciona "noAtual" em FECHADOS

		if "noAtual" == noMeta
			refazer passos. fim.

		foreach 'vizinho do "noAtual"
			if 'vizinho está bloqueado || está em FECHADOS
				continue

			if novo caminho é menor || 'vizinho não está em ABERTOS
				let 'vizinho fCost
				let parent do 'vizinho = "noAtual"

				if 'vizinho não está em ABERTOS
					adiciona 'vizinho em ABERTOS



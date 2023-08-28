.Projeto criado com
	>npx create-react-app <nome do projeto> <enter>

.Bibliotecas externas instaladas (npm install):
	>react-router-dom (rotas/links/paginação)
	>axios (requisições a APIs externas)
	>react-toastify (mensagens ao usuário)
	>react-icons (ícones estilizados)
	>firebase (firebase do Google)
	>date-fns (manipulação de datas) npm install date-fns --save

.Banco de dados utilizado:
	.Cloud Firestore
		.Modo teste
		.Validade até 8.8.2024.

	.Usuário meu:
		.mjmvianna69@gmail.com
		.lembre da dona Gisela

.Nome do Projeto no Firebase:
	.mmAdmin
	.Console:
		.https://console.firebase.google.com/project/mmadmin-afc0f/overview?hl=pt-br

.Authentication:
	.e-mail

.Collections/Documents/Fields:
	.usuarios
		.UID do usuário no Firebase Authentication
			.email: string
			.nome: string
			.status: string ('admin', 'master', 'consulta')

	.pessoas
		.automatic
			.apelidoPessoa: string
			.nomePessoa: string

	.grupos
		.automatic
			.nomeGrupo: string

	.companhias
		.automatic
			.grupoEconomico: string (ID do document da collection grupos)
			.razaoSocial: string
			.shortName: string

	.orgaos
		.automatic
			.nomeOrgao: string
			.siglaOrgao: string

	.cargos
		.automatic
			.nomeCargo: string

	.administradores
		.automatic
			.dtFimMandato: timestamp
			.dtInicioMandato: timestamp
			.uidCargo: string (ID do document da collection cargos)
			.uidCompanhia: string (ID do document da collection companhias)
			.uidOrgao: string (ID do document da collection orgaos)
			.uidPessoa: string (ID do document da collection pessoas)

.Para preparar o site para produção:
	.Incluir arquivo _redirects. na pasta public.
	.Alterar index.js em src:
		-Remover <React.StrictMode> (comentar)

.Para fazer o deploy do projeto via Firebase Hosting:
	.Instalar o client do Firebase via linha de comando
		>npm install -g firebase-tools <enter>
	.Logar no Firebase
		>firebase login <enter>
	.Inicializar Firebase Hosting
		>firebase init hosting <enter>
		Responder as perguntas
			Selecionar o projeto no Firebase
			Selecionar o diretório do build: build

.Deploying o projeto de produção (build) no Firebase:
	.Rodar na linha de comando (cmd):
		>npm run build <enter>
	.Deploy application:
		>firebase deploy --only hosting <enter>

	Project Console: https://console.firebase.google.com/project/mmadmin-afc0f/overview
	Hosting URL: https://mmadmin-afc0f.web.app

.Atualização do GitHub:
	.login mjmvianna69@gmail.com
	.Na linha de comando:
		>git add .
		>git commit -m "Descrição das mudanças"
		>git push origin main

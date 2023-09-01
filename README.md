
# mmAdmin
Cadastro auxiliar de administradores e outros colaboradores de companhias abertas. Utiliza somente dados públicos. Não apresenta informações pessoais sensíveis.

Pode ser utilizado por qualquer pessoa cadastrada.

## Para criar o projeto:
No diretório em que será criada a pasta do projeto
(diretório acima da pasta do projeto):
>npx create-react-app <nome do projeto> <enter>

Serão criados pastas e arquivos para o projeto

Usar nome do projeto em minúsculas sem caracteres especiais e nome curto

Substituir o conteúdo das pastas /public e /src

## Bibliotecas externas instaladas (npm install):
>react-router-dom (rotas/links/paginação)
>axios (requisições a APIs externas)
>react-toastify (mensagens ao usuário)
>react-icons (ícones estilizados)
>firebase (firebase do Google)
>date-fns (manipulação de datas)

## Depois de instalar as bibliotecas:
Substituir os arquivos:
        .firebaserc
        .gitignore
        firebase.json
        package.json
        package-lock.json
        README.md

## Autenticação
Firebase Authenticator
login por e-mail

## Base de dados
Cloud Firestore

Collections/Documents/Fields:
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
			.grupoEconomico: string
             (ID do document da collection grupos)
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
			.uidCargo: string
             (ID do document da collection cargos)
			.uidCompanhia: string
             (ID do document da collection companhias)
			.uidOrgao: string
             (ID do document da collection orgaos)
			.uidPessoa: string
             (ID do document da collection pessoas)

## Autor
[@mjmvianna](https://www.github.com/mjmvianna)


## Feedback
Se você tiver algum feedback, por favor nos deixe saber por meio de mjmvianna69@gmail.com


## Instalação
O projeto ainda está em desenvolvimento.

Recomenda-se aguardar a finalização para instalação.

## Suporte
Para suporte, mande um email para mjmvianna69@gmail.com.

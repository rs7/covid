{
    // let oAuthLink = `https://oauth.vk.com/authorize?client_id=7362610&response_type=token&redirect_uri=close.html`

    let getToken = async () => (await (await fetch(`https://vk.com/covid19`)).text()).match(/"access_token":"(\w+)"/)[1]

    let getList = async (token) => (await (await fetch(`https://api.vk.com/method/execute.info?v=5.103&access_token=${token}`)).json()).response.statusList.items.map(({id: status, text: name}) => ({status, name}))

    let setStatus = async (token, status) => (await (await fetch(`https://api.vk.com/method/users.setCovidStatus?status_id=${status}&v=5.103&access_token=${token}`)).json())

    let getRandom = (list) => list[Math.random() * list.length | 0]

    let loop = (func, timeout) => (func(), setTimeout(() => loop(func, timeout), timeout))

    let main = async () => {
        let token = await getToken()
        let list = await getList(token)
        let delay = 10000

        let run = async () => {
            let {status, name} = getRandom(list)
            let response = await setStatus(token, status)
            console.log(name, response)
        }

        loop(run, delay)
    }

    main()

    console.clear()
}

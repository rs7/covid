// let oAuthLink = `https://oauth.vk.com/authorize?client_id=7362610&response_type=token&redirect_uri=close.html`
{
    let s1 = (color) => `color: #000; background: ${color}; padding: 2px 5px;`
    let s2 = `color: #000; background: #fff; padding: 2px 5px;`

    let log = m => console.log(`%c${m}`, s1(`#9f9`))

    let err = e => {
        console.log(`%c🆘`, s1(`#f99`))
        console.log(e)
    }

    let main = async () => {
        let token
        let list
        let names

        try {
            token = (await (await fetch(`https://vk.com/covid19`)).text()).match(/"access_token":"(\w+)"/)[1]
            log(`🔑`)
            let items = (await (await fetch(`https://api.vk.com/method/execute.info?v=5.103&access_token=${token}`)).json()).response.statusList.items
            names = new Map(items.map(({id, text}) => [id, text]))
            list = items.map(({id}) => id)
        } catch (e) {
            err(e)
            setTimeout(main, 15000)
            return
        }

        let status

        let random = arr => arr[Math.random() * arr.length | 0]

        let loop = async () => {
            status = random(list.filter(item => item !== status))

            let response

            try {
                response = await (await fetch(`https://api.vk.com/method/users.setCovidStatus?status_id=${status}&v=5.103&access_token=${token}`)).json()
            } catch (e) {
                err(e)
                setTimeout(main, 15000)
                return
            }

            if (response.error) {
                err(response.error)
                setTimeout(main, 15000)
                return
            }

            log(`✅ ${names.get(status)}`)
            setTimeout(loop, 10000)
        }

        
        loop()
    }

    main()   
    console.clear()
}

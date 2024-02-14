function vaultItem(index: number, username: string, password: string) {
  return `<li>${username}: ${password} <button onClick="rmPassword(${index})">Remove</button></li>`
}

document.getElementById('select-new-vault').addEventListener('click', () => {
  document.getElementById('new-vault-form').style.display = 'block'
  document.getElementById('load-vault-form').style.display = 'none'
})

document.getElementById('select-load-vault').addEventListener('click', () => {
  document.getElementById('new-vault-form').style.display = 'none'
  document.getElementById('load-vault-form').style.display = 'block'
})

document
  .getElementById('new-vault-form')
  .addEventListener('submit', async event => {
    event.preventDefault()

    const newVaultName = (
      document.getElementById('new-vault-name') as HTMLInputElement
    ).value
    const newVaultKey = (
      document.getElementById('new-vault-key') as HTMLInputElement
    ).value

    await window.ipc.invoke('createVault', newVaultName, newVaultKey)
  })

document
  .getElementById('load-vault-form')
  .addEventListener('submit', async event => {
    event.preventDefault()

    const vaultPath = (
      document.getElementById('load-vault-path') as HTMLInputElement
    ).files[0].path
    const vaultKey = (
      document.getElementById('load-vault-key') as HTMLInputElement
    ).value

    const vault: string[] = await window.ipc.invoke(
      'loadVault',
      vaultPath,
      vaultKey
    )

    let vaultHtml = ''
    vault.forEach((item, index) => {
      const itemSplit = item.split(':')
      vaultHtml += vaultItem(index, itemSplit[0], itemSplit[1])
    })

    document.getElementById('add-password-form').style.display = 'block'
    document.getElementById('vault-items').innerHTML = vaultHtml
  })

document
  .getElementById('add-password-form')
  .addEventListener('submit', async event => {
    event.preventDefault()

    const newUsername = (
      document.getElementById('add-new-username') as HTMLInputElement
    ).value
    const newPassword = (
      document.getElementById('add-new-password') as HTMLInputElement
    ).value

    const index = await window.ipc.invoke(
      'addPassword',
      newUsername,
      newPassword
    )
    document.getElementById('vault-items').innerHTML += vaultItem(
      index,
      newUsername,
      newPassword
    )
  })

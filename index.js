class Component {
    render() {
        return ''
    }

    onRender() {
        if (this.parent) {
            this.parent.innerHTML = this.render()
        }
    }

    attachHandler() {

    }
}

class Table extends Component {
    constructor(parent) {
        super()
        this.rows = []
        this.parent = parent
    }

    render() {
        return `<table>${this.rows.map((row) => `<tr>${row.render()}</tr>`)}</table>`
    }

    addRow(row) {
        this.rows.push(row)
        this.render()
        this.onRender()
        this.parent.onRender()
    }
}

class Row extends Component {
    constructor(parent) {
        super()
        this.columns = []
        this.parent = parent
    }

    addColumn(column) {
        this.columns.push(column)
        this.render()
        this.parent.render()
    }

    render() {
        return this.columns.map(column => `<td>${column}</td>`)
    }
}

const createTextBox = (label) => `<input type="text" id="${label}" placeholder = "${label}">`


class EditGroup extends Component{
    constructor(labels) {
        super()
        this.labels = labels
    }

    setOnClick(onClick) {
        document.getElementById('submit').onclick = () => {
            onClick()
        }
    }

    render() {
        return `<div><div style = "float:left">${this.labels.map(label => createTextBox(label))}</div><button id="submit">submit</button></div>`
    }
}

class MainComponent extends Component {
    constructor(labels) {
        super()
        this.editGroup = new EditGroup(labels)
        this.labels = labels
        this.table = new Table(this)
    }
    setParent(parent) {
        this.parent = parent
    }
    render() {
        return this.table.render() + this.editGroup.render()
    }

    attachHandler() {
      this.editGroup.setOnClick((event) => {
          console.log(event)
          var row = new Row(this.table)
          this.labels.forEach((label) => {
            row.addColumn(document.getElementById(label).value)
          })
          this.table.addRow(row)
          console.log(row)
      })
    }
}

const render = (body, component) => {
    component.setParent(body)
    body.innerHTML = component.render()
    component.attachHandler()
}

render(document.body, new MainComponent(['name', 'subject', 'age', 'salary']))

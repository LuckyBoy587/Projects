let canvas = document.querySelector('canvas')
canvas.width = window.innerWidth 
canvas.height = window.innerHeight
console.log(window.innerWidth)

let context = canvas.getContext("2d")
text_size = 40
win_row = false
click_count = 0
context.font = '40px arial'

let board = [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']]
let players = ['X','O']
class box {
    size = 100
    constructor(i, j,color){
        this.position = {x:(i*120)+200, y:(j*120)+200},
        this.color = color
        this.text = ' '
    }
    draw(){
        context.strokeStyle = this.color
        context.strokeRect(
            this.position.x, this.position.y,
            this.size, this.size
        )
    }
    draw_text(){
        context.fillText(this.text,this.position.x + this.size/2 - text_size/2 + 7,
                        this.position.y + this.size/2 + text_size/2 - 7)
    }
    update_on_collision(mouse_x, mouse_y){
        if (this.position.x < mouse_x &&
            this.position.x + this.size > mouse_x &&
            this.position.y < mouse_y &&
            this.position.y + this.size > mouse_y){
                if(this.text != ' '){return}
                this.text = players[0]
                this.draw_text()
                value_list = get_value_of_board()
                win_row = win_value_list(value_list)
                if (win_row){
                    console.log('won');
                    context.strokeStyle = 'black'
                    context.moveTo(win_row[0].center().x,win_row[0].center().y)
                    context.lineTo(win_row[2].center().x,win_row[2].center().y)
                    context.stroke()
                    canvas.removeEventListener('mousedown',onclick)
                }
                players.reverse()
                click_count++
                if(click_count == 9){
                    canvas.removeEventListener('mousedown',onclick)
                    console.log('draw');
                }
            }
    }
    center(){
        return {x :this.position.x + this.size / 2, y: this.position.y + this.size / 2}
    }
}   
for(let j=0;j<3;j++){
    for(let i=0;i<3;i++){
        board[i][j] = new box(i ,j, 'red')
        board[i][j].draw()
    }
}

function onclick(event){
    for (const row of board) {
        for (const box_obj of row) {
            box_obj.update_on_collision(event.clientX,event.clientY)
        }
    };
}
function get_value_of_board(){
    value_list = [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']]
    for(let y=0;y<3;y++){
        for(let x=0;x<3;x++){
            value_list[x][y] = board[x][y].text
        }
    }
    return value_list
}
function win_value_list(value_list){
    win_lists = [['X','X','X'],1,['O','O','O']]
    index = 0
    for (const row of value_list){
        if(win_lists.toString().includes(row.toString())){
            return board[index]
        }
        index++
    }
    for(let y=0;y<3;y++){
        row = []
        board_row = []
        for(let x=0;x<3;x++){
            row[x] = value_list[x][y]
            board_row[x] = board[x][y]
        }
        if(win_lists.toString().includes(row.toString())){
            return board_row
        }
    }
    if(win_lists.toString().includes([value_list[0][0] , value_list[1][1] , value_list[2][2]].toString())){
        return [board[0][0] , board[1][1] , board[2][2]]
    }
    else if(win_lists.toString().includes([value_list[0][2], value_list[1][1], value_list[2][0]].toString())){
        return [board[0][2], board[1][1], board[2][0]]
    }
    return false
}

canvas.addEventListener('mousedown',onclick)
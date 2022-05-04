import React from 'react'
import {withRouter} from 'react-router-dom'
import './index.css'

class Notfound extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const {history} = this.props
        const {host} = window.location
        return(
            <div className="not-found parallax">
            <div className="sky-bg"></div>
            <div className="wave-7"></div>
            <div className="wave-6"></div>
            <a className="wave-island" onClick={()=>{
                history.push('/dashboard')
                return false
            }}>
                    <img src="http://res.cloudinary.com/andrewhani/image/upload/v1524501929/404/island.svg" alt="Island" />
                </a>
            <div className="wave-5"></div>
            <div className="wave-lost wrp">
                <span>4</span>
                <span>0</span>
                <span>4</span>
            </div>
            <div className="wave-4"></div>
            <div className="wave-boat">
                <img className="boat" src="http://res.cloudinary.com/andrewhani/image/upload/v1524501894/404/boat.svg" alt="Boat" />
            </div>
            <div className="wave-3"></div>
            <div className="wave-2"></div>
            <div className="wave-1"></div>
            <div className="wave-message">
                <p>Your're lost</p>
                <p>点击<a onClick={()=>{
                    history.push('/dashboard')
                    return false
                }}>小岛</a>回到首页</p>
            </div>
        </div>
        )
    }
}
export default withRouter(Notfound)
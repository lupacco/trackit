import styled from "styled-components"
//Components
import Header from "./Header"
import Footer from "./Footer"
import WeekDays from "./WeekDays"
import weekdays from "../weekdays"

import { useEffect, useState } from "react"
import axios from "axios"


export default function Habits({userInfo}){
    const [creatingHabit, setCreatingHabit] = useState(false)
    //name of the habit being created
    const [habitName, setHabitName] = useState('')
    //the days user must select to create habit
    const [selectedDays, setSelectedDays] = useState([])
    
    const [habitsList, setHabitsList] = useState([])
    const [inputsDisabled, setInputsDisabled] = useState(false)

    //operations released in section
    const [operations, setOperations] = useState(0)
    

    function transformIdToDay(daysId){
        let daysNames = []
        for(let i in daysId){
            daysNames.push(weekdays[daysId[i]-1])
        }
        return daysNames
    }

    function createHabit(){
        setInputsDisabled(true)
        let daysId = []
        for(let i in weekdays){
            if(selectedDays.includes(weekdays[i])){
                daysId.push(Number(i)+1)
            }
        }

        axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits',{
            name:habitName,
            days:daysId
        },{
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(res =>{
            setHabitName('')
            setOperations(operations+1)
            setCreatingHabit(false)
            setSelectedDays([])
            setInputsDisabled(false)
        })
        .catch(err => {
            console.log(err)
            setInputsDisabled(false)
        })
    }

    function deleteHabit(habitId){
        axios.delete(`https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${habitId}`,{
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(res => {
            console.log(res)
            setOperations(operations+1)
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        //listing habits
        axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits',{
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        .then(res => {
            // console.log(res.data)
            setHabitsList(res.data)
        })
        .catch(err => console.log(err))
    },[operations])

    return(
        <>
            <Header picture={userInfo.image}/>
            <HabitsContainer>
                <CreateHabit>
                    <p>Meus hábitos</p>
                    <button data-test="habit-create-btn" onClick={() => setCreatingHabit(true)}>
                        <ion-icon name="add-outline"></ion-icon>
                    </button>
                </CreateHabit>
                {creatingHabit && 
                    <CreatingHabit data-test="habit-create-container">
                        <input disabled={inputsDisabled} data-test="habit-name-input" value={habitName} required onChange={e => setHabitName(e.target.value)} placeholder="nome do hábito"></input>
                        <WeekDays 
                            isDisabled={false}
                            selectedDays={selectedDays}
                            setSelectedDays={setSelectedDays}
                            weekdays={weekdays}
                        />

                        <CancelSave>
                            <button 
                            disabled={inputsDisabled}  
                            data-test="habit-create-cancel-btn" 
                            onClick={() => setCreatingHabit(false)} className="cancel">Cancelar</button>
                            <button
                            disabled={inputsDisabled} 
                            data-test="habit-create-save-btn"
                            onClick={createHabit} className="save">Salvar</button>
                        </CancelSave>
                    </CreatingHabit>
                }

                {habitsList.length > 0 &&
                    habitsList.map(habit => (
                        <CreatedHabit data-test="habit-container" key={habit.id}>
                            <ion-icon data-test="habit-delete-btn" onClick={() => deleteHabit(habit.id)} name="trash-outline"></ion-icon>
                            <p data-test="habit-name">{habit.name}</p>
                            <WeekDays weekdays={weekdays} selectedDays={transformIdToDay(habit.days)} isDisabled={true}/>
                        </CreatedHabit>
                    ))
                }
                {habitsList.length === 0 && 
                    <p>
                    Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para começar a trackear!
                    </p>
                }
            </HabitsContainer>
            <Footer/>
        </>
    )
}

const HabitsContainer = styled.main`
    background-color: #E5E5E5;
    height: 100vh;
    padding: 100px 16px 64px 16px ;
    margin-bottom: 5vh;
    overflow-y: scroll;
    >p{
        margin-top: 32px;
        font-size: 18px;
        color: #666666;
    }
    
`
const CreateHabit = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    >p{
        color: #126BA5;
        font-size: 24px;
    }
    >button{
        width: 40px;
        height: 35px;
        background-color: #52B6FF;
        color: #FFFFFF;
        border-radius: 6px;
        border-style: none;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`
const CreatingHabit = styled.div`
    width: 340px;
    height: 180px;
    background-color: #FFFFFF;
    border-radius: 6px;
    padding: 16px;
    margin: auto;
    >input{
        width: 303px;
        height: 45px;
        border: solid 1px #D4D4D4;
        border-radius: 6px;
        padding-left: 16px;
        font-size: 20px;
        &::placeholder{
            color: #DBDBDB;
        }
    }
`
const CancelSave = styled.div`
    display: flex;
    justify-content: right;
    >button{
        width: 84px;
        height: 35px;
        border-style: none;
        border-radius: 6px;
        margin-left: 4px;
        font-size: 16px;
    }
    >.cancel{
        background-color: #FFFFFF;
        color: #52B6FF;
    }
    >.save{
        background-color: #52B6FF;
        color: #FFFFFF;
    }
`
const CreatedHabit = styled.div`
    margin: 16px auto;
    width:340px;
    height:100px;
    background: #FFFFFF;
    border-radius: 6px;
    padding: 16px;
    position: relative;
    >p{
        font-size: 20px;
        margin-bottom: 0;
    }
    >ion-icon{
        position: absolute;
        top: 16px;
        right: 16px;
        color: #666666;
    }
    
`
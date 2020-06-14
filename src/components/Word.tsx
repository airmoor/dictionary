import axois from 'axios';
import React, { useState, useEffect } from 'react';
import {Typography, makeStyles, Box} from '@material-ui/core';
import DefinitionList from './DefinitionList';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: '600px',
      borderRadius: 10,
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
      margin: 50,
      padding: '30px 30px',
    },
    inline: {
      display: 'inline',
    },
    word: {
        padding: '30px 10px',
    },
    subtitle: {
        paddingLeft: '16px'
    }
  }));

type AppProps = {word: string}

export default function Word ({word}:AppProps)  {
    const classes = useStyles();
    const [wordData, setWordData] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isNotFound, setNotFound] = useState(false)

    const [values, setValues] = useState({
        types: Array<any> ([]),
        transcription: '',
        audio: ''
    })
  
    const KEY = 'ce4a9515-e40e-4234-8605-58c5475fd9dc'
    const URL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json'
    
    useEffect( () => {
        axois.get(`${URL}/${word}?key=${KEY}`)
        .then( (response) => {
            console.log(response)
            let data = response.data
            data = data.filter((item: { shortdef: string; }) => item.shortdef !='')
            if (data.length===0) setNotFound(true)
            if (typeof data[0]==='string') setNotFound(true)
            if (typeof data[0]==='object') setNotFound(false)

            let wordTypes: Array<any> = []

            for (let elem of data) {
                if (!wordTypes.includes(elem.fl)) wordTypes.push(elem.fl)
            }

            console.log(data)
            console.log(wordTypes)

            setIsLoaded (true)
            setWordData(data)
            setValues({...values,   
                        types: wordTypes,
                        transcription:data[0].hwi.prs[0].mw, 
                        audio:data[0].hwi.prs[0].sound.audio})
            })

        .catch((error) => {
            console.log('error', error)
            setIsLoaded (true)
        })
    }, [word])

    
    return ( 
        <Box className={classes.word}>
            {
                !isLoaded && (
                <Typography variant='h4'>...loading...</Typography>
                )
            }
            {
                isLoaded && isNotFound && (
                <Typography variant='h4'>no such word</Typography>
                )
            }
            {
                isLoaded && !isNotFound && (
                <> 
                    <Typography variant='h4'> {word} </Typography>
                    {
                        values.transcription && (
                            <Typography variant='h6'> 
                                /{values.transcription}/ 
                            </Typography>
                        )
                    }
                   
                    {values.types.map(type => (
                        <>
                            <Typography variant='subtitle2' className={classes.subtitle} align='left'>{type}</Typography>
                            <DefinitionList wordData={wordData.filter(item=>item.fl===type)}/>
                        </>
                    ))}
                  
                </>
                )
            }
        </Box>
    )
}


import axois from 'axios';
import React, { useState, useEffect } from 'react';
import {Typography, makeStyles, Box, IconButton} from '@material-ui/core';
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
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
        audioUrl: ''
    })
    const KEY = 'ce4a9515-e40e-4234-8605-58c5475fd9dc'
    const URL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json'
    
    useEffect( () => {
        axois.get(`${URL}/${word}?key=${KEY}`)
        .then( (response) => {
            console.log(response)
            let data = response.data
            setIsLoaded (true)
            setData(data)
        })

        .catch((error) => {
            console.log('error', error)
            setIsLoaded (true)
        })
    }, [word])


    const setData = (data:Array<any>) => {
        data = data.filter((item: { shortdef: string; }) => item.shortdef !='')
        if (data.length===0)           setNotFound(true);
        if (typeof data[0]==='string') setNotFound(true);
        if (typeof data[0]==='object') setNotFound(false);
        setWordData(data);
        
        let wordTypes: Array<any> = []
            for (let elem of data) {
                if (!wordTypes.includes(elem.fl)) wordTypes.push(elem.fl)
            }

        let audio=data[0].hwi.prs[0].sound.audio;
        let audioUrl=makeSoundUrl(audio);
        setValues({...values,   
                    types: wordTypes,
                    transcription:data[0].hwi.prs[0].mw, 
                    audioUrl:audioUrl,
        })
    }
    
    const makeSoundUrl = (audio:string) => {
        const baseUrl='https://media.merriam-webster.com/audio/prons/en/us';
        const format='mp3'; //mp3        wav        ogg
        let subdirectory;
        if (audio.slice(0,3)==='bix') subdirectory='bix';   //if audio begins with "bix", the subdirectory should be "bix",
        else if (audio.slice(0,2)==='gg') subdirectory='gg'; //if audio begins with "gg", the subdirectory should be "gg",
        else if (typeof audio.slice(0,1)==='number') subdirectory='number'; //if audio begins with a number or punctuation (eg, "_"), the subdirectory should be "number",
        else if (audio.slice(0,1)==='_') subdirectory='number'; //if audio begins with a number or punctuation (eg, "_"), the subdirectory should be "number",
        else subdirectory=audio.slice(0,1); // otherwise, the subdirectory is equal to the first letter of audio.
        let url=`${baseUrl}/${format}/${subdirectory}/${audio}.${format}`;
        return url;
    }

    const playSound = () => {
        const audio = new Audio(values.audioUrl);
        audio.play()
    }

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
                            <Box display='flex' justifyContent='center' alignItems='center'>
                                <IconButton onClick={playSound}>
                                    <VolumeUpIcon/>
                                </IconButton>
                                <Typography variant='h6'> 
                                    /{values.transcription}/ 
                                </Typography>
                            </Box>
                            
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


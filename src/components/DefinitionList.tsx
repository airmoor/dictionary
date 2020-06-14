import React from 'react';
import {Typography, List, ListItem, ListItemText, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));

type AppProps = {wordData: Array<any>}

export default function DefinitionList ({wordData}:AppProps)  {
    const classes = useStyles();
    
    return ( 
        <List>
        {wordData.map(word => (
            <>
            {                        
                word.shortdef && 
                    word.shortdef.map((shortdef: React.ReactNode) => (
                        <ListItem button> 
                            <ListItemText
                                primary = {
                                    <Typography>{shortdef}</Typography>
                                }
                            />
                        </ListItem>
                    ))
            }
            </>
        ))
        }
        </List>
    )
}


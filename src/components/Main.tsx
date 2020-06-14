import React, { useState } from 'react';
import {makeStyles, fade} from '@material-ui/core';
import {Typography, Box, AppBar, InputBase, IconButton, Toolbar} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Word from './Word';

const useStyles = makeStyles((theme)=> ({
    root: {
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#EBEBEB',
        minHeight:'500px',
        borderRadius: 5,
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        margin: 50,
        padding: '30px 30px',
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    appBar: {
        borderRadius: 5,
    },
    toolbar: {
        justifyContent: 'space-between'
    },
    inline: {
        display: 'inline',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
  }));

export default function Main ()  {
    const classes = useStyles();
    const [inputText, setInputText] = useState('');
    const [word, setWord] = useState('');
    const [submit, setSubmit] = useState(false)
    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputText(event.target.value);
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setSubmit(true)
        setWord(inputText)
    }
    
    return ( 
        <React.Fragment>
            <Box className={classes.root}>
                <AppBar position="static" color="secondary" className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <Typography className={classes.title} variant="h6" noWrap>
                            FindWord
                        </Typography>
                        
                        <form className={classes.search} noValidate autoComplete="off">
                            <IconButton type='submit' onClick={handleSubmit}>
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                placeholder="Input word…"
                                id="inputText" value={inputText} onChange={handleChange}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </form>
                        <IconButton edge='end'>
                            <AccountCircle />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {
                    submit && (<Word word = {word} />)
                }
                {
                    !submit && (<Word word = 'example' />)
                }
            </Box>
        </React.Fragment>
    )

}


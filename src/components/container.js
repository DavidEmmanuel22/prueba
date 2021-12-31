import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import movieData from '../jsons/moviedata' 
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import {
  TextField,
  Button
} from '@material-ui/core'
import emailjs from '@emailjs/browser';
import apiKeys from '../keys'
import Cookies from 'universal-cookie'
import petitions from '../petitions/petitions'

const cookies = new Cookies()
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const styleBox = {
  width: '80%',
  marginLeft: '10%',
  marginRight: '10%'
};
const styleTitle = {
  width: '33%',
  fontSize: '3em',
  marginLeft: '35%',
  marginRight: '35%'
};
const Container = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [start, setStart] = React.useState(0);
  const [moviesArray, setMoviesArray] = React.useState(movieData);
  const [favoriteMovies, setFavoriteMovies] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [status, setStatus] = React.useState(false);
  const [changeFavorites, setChangeFavorites] = React.useState(false);
  const [changeFavoritesCoockies, setChangeFavoritesCoockies] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [nombre, setNombre] = React.useState('');
  const [genero, setGenero] = React.useState('');
  const [titulo, setTitulo] = React.useState('');
  const [director, setDirector] = React.useState('');
  const [rate, setRate] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [toSend, setToSend] = useState({
    title: '',
    director: '',
    rating: '',
    to: '',
  });


  React.useEffect(() => {
    if(status == false){
      changesImages()  
  
    }
      

      if(changeFavoritesCoockies == false)
        if(cookies.get('favorites')){
          setFavoriteMovies(cookies.get('favorites')) 
          setChangeFavoritesCoockies(true)
        }
        else{
          console.log("else")
        }    
          
        //filterArrayDates()

  });
  const handleChange = (event, value) => {
    var startVal = value * 10
    var limitVal = (value + 1) * 10
    setPage(value);
    setLimit(limitVal)
    setStart(startVal)
    changesImages()


  };
  const handleOpen = (event, title, director, rate) =>{
    setTitulo(title)
    setDirector(director)
    setRate(rate)
     setOpen(true);
  }
  const handleSave = (event, movie) =>{
    favoriteMovies.push(movie)
    cookies.set('favorites', favoriteMovies, { parth: '/'});
    setChangeFavoritesCoockies(true)
    setFavoriteMovies(favoriteMovies)
    if(changeFavorites)
      setChangeFavorites(false)
    else 
      setChangeFavorites(true)

  }

  const changeNombre = (event) => {
    console.log(event.target.value)
    setNombre(event.target.value)
    filterArray(event.target.value)

  };
  const changeEmail = (event) => {
    setEmail(event.target.value)

  };
  const changeTitulo = (event) => {
    setTitulo(event.target.value)

  };
  const changeDirector = (event) => {
    setDirector(event.target.value)

  };
  const changeRate = (event) => {
    setRate(event.target.value)

  };
  const changeGenero = (event) => {
    console.log(event.target.value)
    setGenero(event.target.value)
    filterArrayGenero(event.target.value)

  };
  const filterArray = (nombres) => {
    if(nombres == ''){
      setMoviesArray(movieData)
    }else{
      const filtros = moviesArray.filter(it => it.title.includes(nombres))
      setMoviesArray(filtros)
    }
  }
  const filterArrayDates = () => {
    const min = '2013-09-02T00:00:00Z';

    const max = '2014-06-25T00:00:00Z';
    const fl = moviesArray.filter(mv => (mv.info.release_date) >= min && (mv.info.release_date) <= max)
   
  }

  const filterArrayGenero = (genre) => {
    if(genero == ''){
      setMoviesArray(movieData)

    }else{
      moviesArray.map((movie) => {
        console.log(movie.info.genres)
        const mvf = movie.info.genres.filter(filtro => filtro.include(genre))
        console.log(mvf)
      }) 
    }
  }
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const sendEmail = (e) =>{
    setToSend({title: titulo, director: director, rating: rate, to: email})

    emailjs.send(apiKeys.SERVICE_ID, apiKeys.TEMPLATE_ID, toSend, apiKeys.USER_ID)
    .then(result => {
      console.log(result.text)
      setTitulo('')
      setDirector('')
      setRate('')
      setEmail('')
      handleClose()
    },
    error => {
      console.log(error.text)
      setTitulo('')
      setDirector('')
      setRate('')
      setEmail('')
      handleClose()

    })
  }
  const changesImages = () => {
    moviesArray.slice(start,limit).map((movie) => {
      const filtro = moviesArray.filter(item=> item.title === movie.title);
      if(filtro.length > 0){
        filtro.map((fl) => {
          petitions.petitionImage(fl.title).then(res =>{
            fl.info.poster = `${res.data.Search[0].Poster}`
          
            if(status)
              setStatus(false)
            else 
              setStatus(true)



          })

       
      });
      } else {
        console.log("no se encotrno")
      }    /*
      });*/
     


    })
    setMoviesArray(moviesArray)

    
  }

  return (

    <Box sx={styleBox}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <TextField
          autoFocus
            style={{
              width: '100%',
              backgroundColor: 'white'
            }}
            label={"Email"}
            variant="filled"
            name="Email"
            value={email}
            onChange={changeEmail}
            placeholder={"Email"}

          />
        <TextField
          autoFocus
            style={{
              width: '100%',
              backgroundColor: 'white'
            }}
            label={"Titulo"}
            variant="filled"
            name="Titulo"
            value={titulo}
            onChange={changeTitulo}
            placeholder={"Titulo"}

          />
           <TextField
            autoFocus
              style={{
                width: '100%',
                backgroundColor: 'white'
              }}
              label={"Director"}
              variant="filled"
              name="Director"
              value={director}
              onChange={changeDirector}
              placeholder={"Director"}

            />
         <TextField
            autoFocus
              style={{
                width: '100%',
                backgroundColor: 'white'
              }}
              label={"Rate"}
              variant="filled"
              name="Rate"
              value={rate}
              onChange={changeRate}
              placeholder={"Rate"}
              placeholderTextColor="#000" 

            />
                  <Button onClick={sendEmail}>Enviar</Button>

        </Box>
      </Modal>
       <TextField
          autoFocus
            style={{
              width: '50%',
              backgroundColor: 'white'
            }}
            label={"Nombre"}
            variant="filled"
            name="Nombre"
            value={nombre}
            onChange={changeNombre}
            placeholder={"Nombre"}

          />
           <TextField
          autoFocus
            style={{
              width: '50%',
              backgroundColor: 'white'
            }}
            label={"Genero"}
            variant="filled"
            name="Genero"
            value={genero}
            onChange={changeGenero}
            placeholder={"Genero"}

          />
      <Typography variant="body" color="black" sx={styleTitle}>
        Peliculas
      </Typography>
      <Grid container spacing={4}>
     
      {moviesArray.slice(start,limit).map((movie) => (
          
          <Grid item xs={3} md={3}>
          <Card sx={{ maxWidth: 345 }}>
          <CardHeader
            title={movie.title}
            subheader={movie.info.release_date}
          />
          <CardMedia
            component="img"
            height="194"
            image={movie.info.poster}
            alt={movie.title}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Director: {movie.info.directors[0]}
            </Typography>
           
            <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
          </CardContent>
          
          <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
          <Typography variant="body2" color="text.secondary">
              Rating: {movie.info.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Generos: {movie.info.genres.map((genero) =>(
              <Typography variant="body2" color="text.secondary">
                {genero}
              </Typography>

            ))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Actores: {movie.info.actors.map((actores) =>(
              <Typography variant="body2" color="text.secondary">
                {actores}
              </Typography>

            ))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            plot: {movie.info.plot}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: {movie.info.rating}
            </Typography>

          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon onClick={(event) => handleSave(event, movie)} aria-label="share" />
            </IconButton>
            <IconButton onClick={(event) => handleOpen(event, movie.title, movie.info.directors[0], movie.info.rating)} aria-label="share">
              <ShareIcon />
            </IconButton>
           
          </CardActions>
      </Collapse>
        </Card>
        </Grid>
        ))
      
      }
    </Grid>
    <Typography variant="body" color="text.secondary" sx={styleTitle}>
              Favoritas
      </Typography>
      <Grid container spacing={4}>
     
      {favoriteMovies.slice(start,limit).map((movie) => (
          
          <Grid item xs={3} md={3}>
          <Card sx={{ maxWidth: 345 }}>
          <CardHeader
            title={movie.title}
            subheader={movie.info.release_date}
          />
          <CardMedia
            component="img"
            height="194"
            image={movie.info.poster}
            alt={movie.title}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Director: {movie.info.directors[0]}
            </Typography>
           
            <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
          </CardContent>
          
          <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
          <Typography variant="body2" color="text.secondary">
              Rating: {movie.info.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Generos: {movie.info.genres.map((genero) =>(
              <Typography variant="body2" color="text.secondary">
                {genero}
              </Typography>

            ))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Actores: {movie.info.actors.map((actores) =>(
              <Typography variant="body2" color="text.secondary">
                {actores}
              </Typography>

            ))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            plot: {movie.info.plot}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: {movie.info.rating}
            </Typography>

          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon onClick={(event) => handleSave(event, movie)} aria-label="share" />
            </IconButton>
            <IconButton onClick={(event) => handleOpen(event, movie.title, movie.info.directors[0], movie.info.rating)} aria-label="share">
              <ShareIcon />
            </IconButton>
           
          </CardActions>
      </Collapse>
        </Card>
        </Grid>
        ))
      
      }
    </Grid>
    <Stack spacing={2}>

      <Pagination count={10} page={page} onChange={handleChange} />
     
    </Stack>
    </Box>
  )
}

export default Container

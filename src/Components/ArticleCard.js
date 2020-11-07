import React from 'react';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography, makeStyles } from '@material-ui/core';
import error from './error.png'


const useStyles = makeStyles({
    root: {
        maxWidth: 400,
    },
});

const onError = (event) => {
    event.target.src = error;
}

const parseTime =  (time) => {
    time = time.split("T");
    let date = time[0];

    date = date.split("-");
    date = [date[1], date[2], date[0]];
    date = date.join("-");
    console.log(date);

    return date;
}

export default function ArticleCard(props) {
    const classes = useStyles();
    console.log(props.article.urlToImage);
    let image = (props.article.urlToImage === undefined) ? error : props.article.urlToImage;

    return (
        <Card className={classes.root}>
            <CardActionArea>
                {props.article.urlToImage === null ? null :
                    <CardMedia
                        component='img'
                        height="200"
                        alt="Failed to Load Resource"
                        image={image}
                        onError={(event) => onError(event)}
                        title={props.article.title}
                    />}
                <CardContent>
                    <Typography gutterBottom component='h2'>
                        {props.article.title}
                    </Typography>
                    <Typography variant='body1' component='p'>
                        {props.article.author}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.article.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color='inherit' href={props.article.url} target="_blank" rel="noreferrer">
                    {props.article.source.name}
                </Button>
                <Typography variant='body2' color='secondary'>
                    Published {parseTime(props.article.publishedAt)}
                </Typography>
            </CardActions>
        </Card>
    );
}
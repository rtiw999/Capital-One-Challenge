import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TopHead from '../Components/TopHeadForm'
import Everything from '../Components/EverythingForm'
import ArticleCard from '../Components/ArticleCard'
import { Grid, Paper, Typography, AppBar, Tab, Tabs, withStyles } from '@material-ui/core';

const useStyles = theme => ({
    root: {
        flex: 1,
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
          marginTop: theme.spacing(6),
          marginBottom: theme.spacing(6),
          padding: theme.spacing(3),
        },
    },
    layout: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
          width: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
      paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
          marginTop: theme.spacing(6),
          marginBottom: theme.spacing(6),
          padding: theme.spacing(3),
        },
      },
      buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
      },
})

const endpoints = [{ name: "Top headlines", endpoint: 'top-headlines' }, { name: "Everything", endpoint: 'everything' }];
const baseURL = new URL('https://newsapi.org/v2/');

class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            ep: endpoints[0].endpoint,
            url: "",
            jsonData: null
        }
    }

    componentDidUpdate() {
        if (this.state.url !== "") {
            fetch(this.state.url)
                .then(res => res.json())
                .then(parsedData => {
                    this.setState({
                        jsonData: parsedData,
                        url: ""
                    })
                })
                .catch(err => console.error(err));
        }

        console.log(this.state.jsonData);
    }

    a11yProps = (index) => {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    handleChange = (event, newValue) => {
        this.setState({
            tab: newValue,
            ep: endpoints[newValue].endpoint
        })
    }

    handleParams = (params) => {
        let URL = baseURL.toString();
        URL = URL.replace('v2/', `v2/${this.state.ep}?`);
        console.log(URL);
        URL = URL + params.toString();
        console.log("Should be change now: " + URL)

        this.setState({ url: URL });
    }

    displayForm = () => {
        switch (this.state.tab) {
            case 0:
                return (
                    <>
                        <TopHead getParams={this.handleParams} />
                    </>
                );
            case 1:
                return (
                    <>
                        <Everything getParams={this.handleParams} />
                    </>
                );
            default:
                return (
                    <>
                        <TopHead getParams={this.handleParams} />
                    </>
                )
        }
    }

    displayCards = () => {
        if (this.state.jsonData.status !== "ok") {
            return (
                <Grid container justify='center'>
                    <Grid item>
                        <Typography color='error' variant='h2'> Unfortunately, the network request failed. Please try again. </Typography>
                    </Grid>
                </Grid>
            )
        } else if (this.state.jsonData.totalResults === 0) {
            return (
                <Grid container justify='center'>
                    <Grid item>
                        <Typography color='error' variant='h2'> Unfortunately your search didn't turn up anything. Please try again. </Typography>
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <Grid container direction='row' className={this.props.paper} justify='center' alignItems='center'>
                    {this.state.jsonData.articles.map(thingy => (
                        <Grid item xs={4}>
                            <ArticleCard article={thingy}/>
                        </Grid>
                    ))}
                </Grid>
            )
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Grid container className={classes.layout}>
                    <AppBar position="fixed" color='default'>
                        <Tabs
                            value={this.state.tab}
                            onChange={this.handleChange}
                            indicatorColor="secondary"
                            textColor="secondary"
                            centered
                        >
                            <Tab label={endpoints[0].name} {...this.a11yProps(0)} />
                            <Tab label={endpoints[1].name} {...this.a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <Paper className={classes.paper}>
                        {this.displayForm()}
                    </Paper>
                </Grid>
                {this.state.jsonData === null ? null : this.displayCards()}
            </div>
        )
    }
}

// Sets props to include the styling from useStyles()
SearchScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(SearchScreen);
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Paper, AppBar, Tab, withStyles, Grid, Typography, Fade, Grow, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import TopHead from '../Components/TopHeadForm';
import EverythingForm from '../Components/EverythingForm';
import ArticleCard from '../Components/ArticleCard';
import { teal } from '@material-ui/core/colors';

const useStyles = theme => ({
    root: {
        flexGrow: 1,
        justifyContent: 'space-around',
        flexDirection: 'row-reverse',
        alignItems: 'space-between',
        backgroundColor: '#faebd7'
    },
    layout: {
        justifyContent: 'space-around',
        flexDirection: 'row-reverse',
        alignItems: 'space-between',
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        justifyItems: 'space-between',
        flexDirection: 'column',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    cards: {
        direction: 'row',
        justify: 'center',
        alignItems: 'center',
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            padding: theme.spacing(7),
        },
    },
});

const overallTheme = createMuiTheme({
    palette: {
        primary: {
            main: teal[200]
        },
        secondary: {
            main: teal[400],
          },
    }
});

const proxy = "https://nifty-lalande-f5761d.netlify.app";
const baseURL = new URL(`${proxy}https://newsapi.org/v2/`);
const endpoints = [{ name: "Top Headlines", value: "top-headlines" }, { name: "Everything", value: "everything" }]

class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            ep: endpoints[0].value,
            jsonInfo: null,
            loading: false,
            qParams: "",
            url: ""
        }

    }

    // Used to make API calls to the NewsAPI whenever the proper url is constructed
    componentDidUpdate() {
        if ("" !== this.state.url) {
            const query = this.state.url + this.state.qParams;

            fetch(query)
                .then(res => res.json())
                .then(parsed => {
                    this.setState({
                        loading: true,
                        jsonInfo: parsed
                    })
                }).catch(e => { console.error(e) });

            this.setState({ url: "" });
        }

        console.log(this.state.jsonInfo);
    }

    a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    setTab = (newVal) => {
        this.setState({ tab: newVal });
    }

    setEP = (newVal) => {
        this.setState({ ep: endpoints[newVal].value });
    }

    handleChange = (event, newValue) => {
        let index = newValue;
        this.setTab(index);
        this.setEP(index);
    }

    handleFetch = (params) => {
        let URL = baseURL.toString();
        URL = URL.replace('v2/', `v2/${this.state.ep}?`);

        this.setState({
            loading: false,
            url: URL,
            qParams: params
        });
    }

    /*
        A method that will render the correct form depending upon the setting of the App Bar at the top of the page.
    */
    getForm = (tab) => {
        switch (tab) {
            case 0:
                return (
                    <React.Fragment>
                        <TopHead getParams={this.handleFetch} />
                    </React.Fragment>
                );
            case 1:
                return (
                    <React.Fragment>
                        <EverythingForm getParams={this.handleFetch} />
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment>
                        <Typography variant='h6' color='secondary' align='center' font='Roboto'>
                            Note: If you search using sources, your will not be able to search by country or categories.
                        </Typography>
                        <TopHead getParams={this.handleFetch} />
                    </React.Fragment>
                );
        }
    }

    /* 
        A method that display all of the articles returned by the fetch request with the user's parameters. If there are
        no results, then it will print that there are no results.
    */
    displayArticles = () => {
        if (this.state.jsonInfo === null) {
            return null;
        } else if (this.state.jsonInfo.status === "error") {
            return (
                <>
                    <Grid container justify='center'>
                        <Grid item alignContent='center' >
                            <Typography variant='h4' color='error'>{this.state.jsonInfo.status.message}</Typography>
                        </Grid>
                    </Grid>
                </>
            );
        } else {
            if (this.state.jsonInfo.totalResults === 0) {
                return (
                    <>
                        <Fade in={this.state.loading}>
                            <Typography color='error' component='header' variant='h5'>
                                Unfortunately, there are no results for this search. Please try again.
                             </Typography>
                        </Fade>
                    </>
                );
            } else {
                return (
                    <>
                        <Grid
                            container
                            className={this.props.classes.cards}
                        >
                            {this.state.jsonInfo.articles.map((thingy) => (
                                <Grid item xs={4}>
                                    <Grow in={this.state.loading} timeout={{ appear: 2000 }}>
                                        <div>
                                            <ArticleCard
                                                key={thingy.source.id}
                                                article={thingy}
                                            />
                                        </div>
                                    </Grow>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                );
            }
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <MuiThemeProvider theme={overallTheme}>
                    <Grid container className={classes.layout}>
                        <AppBar position="static" color="inherit">
                            <Tabs
                                value={this.state.tab}
                                indicatorColor="secondary"
                                textColor="secondary"
                                onChange={this.handleChange}
                                variant="fullWidth"
                            >
                                <Tab value={0} label={endpoints[0].name} {...this.a11yProps(0)} />
                                <Tab value={1} label={endpoints[1].name} {...this.a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                        <Paper className={classes.paper}>
                            {this.getForm(this.state.tab)}
                        </Paper>
                    </Grid>
                    {this.displayArticles()}
                </MuiThemeProvider>
            </div>
        );
    }
}

// Sets props to include the styling from useStyles()
SearchScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(SearchScreen);

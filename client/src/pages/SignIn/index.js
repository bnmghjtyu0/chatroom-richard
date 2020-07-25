/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import validate from 'validate.js'
import { makeStyles, useTheme, withStyles } from '@material-ui/styles'
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import { css, jsx } from '@emotion/core'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers'
import { UserContext } from '../../context/userContext'

const regex = {
  password: /^[A-Z]+.*/
}

const schemaYup = Yup.object().shape({
  username: Yup.string().required('請輸入帳號'),
  password: Yup.string()
    .required('請輸入密碼')
    .matches(regex.password, '第一個字母是英文大寫'),
  room: Yup.string().required('請輸入房間')
})

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${require('../../assets/images/bg3.jfif')})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  toggleButton: {
    padding: "6px 12px",
    marginRight: 12,

    '&.Mui-selected': {
      background: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        background: theme.palette.primary.main,
        color: '#fff'
      }
    },
    '&:hover': {
      background: theme.palette.primary.main,
      color: '#fff'
    }
  }
}))

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    // margin: theme.spacing(0.5),
    // border: 'none',
    '&:not(:first-child)': {
      borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
      borderRadius: 4
    },
    '&:first-child': {
      borderRadius: 4
      // borderRadius: theme.shape.borderRadius
    }
  }
}))(ToggleButtonGroup)
const SignIn = (props) => {
  const { history } = props
  const theme = useTheme()
  const classes = useStyles()
  const { users, setUsers } = React.useContext(UserContext)

  const handleBack = () => {
    history.goBack()
  }
  const handleHome = (username, room) => {
    history.push({
      pathname: '/',
      // search: `?username=${username}`
      state: {
        detail: {
          username: username,
          room: room
        }
      }
    })
  }

  const { register, errors, handleSubmit, clearError, control } = useForm({
    initialValues: {
      username: '',
      password: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schemaYup)
  })

  const onSubmit = (data, e) => {
    e.preventDefault()
    setUsers({ username: data.username, room: data.room })
    localStorage.setItem('username', data.username)
    handleHome(data.username, data.room)
  }

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h1">
                Hella narwhal Cosby sweater McSweeney's, salvia kitsch before
                they sold out High Life.
              </Typography>
              <div className={classes.person}>
                <Typography className={classes.name} variant="body1">
                  Takamaru Ayako
                </Typography>
                <Typography className={classes.bio} variant="body2">
                  Manager at inVision
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              {/* <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton> */}
            </div>
            <div className={classes.contentBody}>
              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <Typography className={classes.title} variant="h2">
                  輸入名字進入聊天室
                </Typography>
                <Controller
                  as={
                    <TextField
                      className={classes.textField}
                      fullWidth
                      label="username"
                      type="text"
                      variant="outlined"
                      error={errors.username}
                    />
                  }
                  name="username"
                  control={control}
                  defaultValue=""
                />

                <p
                  css={css`
                    color: ${theme.palette.error.main};
                  `}>
                  {errors.username?.message}
                </p>

                <Controller
                  as={
                    <TextField
                      className={classes.textField}
                      fullWidth
                      label="Password"
                      type="password"
                      variant="outlined"
                      error={errors.password}
                    />
                  }
                  name="password"
                  control={control}
                  defaultValue=""
                />
                <p
                  css={css`
                    color: ${theme.palette.error.main};
                  `}>
                  {errors.password?.message}
                </p>
                <Controller
                  as={
                    <StyledToggleButtonGroup
                      exclusive
                      aria-label="text alignment"
                      className={classes.toggleGroup}>
                      <ToggleButton
                        value="RoomA"
                        aria-label="RoomA"
                        className={classes.toggleButton}>
                        RoomA
                      </ToggleButton>
                      <ToggleButton
                        value="RoomB"
                        aria-label="RoomB"
                        className={classes.toggleButton}>
                        RoomB
                      </ToggleButton>
                      <ToggleButton
                        value="RoomC"
                        aria-label="RoomC"
                        className={classes.toggleButton}>
                        RoomC
                      </ToggleButton>
                    </StyledToggleButtonGroup>
                  }
                  name="room"
                  control={control}
                  defaultValue="RoomA"
                  css={css`
                    margin-top: 16px;
                  `}
                />
                <p
                  css={css`
                    color: ${theme.palette.error.main};
                  `}>
                  {errors.room?.message}
                </p>
                <Button
                  className={classes.signInButton}
                  color="primary"
                  disabled={Object.keys(errors).length !== 0}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained">
                  登入
                </Button>
                {/* <Typography color="textSecondary" variant="body1">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/sign-up" variant="h6">
                    Sign up
                  </Link>
                </Typography> */}
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

SignIn.propTypes = {
  history: PropTypes.object
}

export default withRouter(SignIn)

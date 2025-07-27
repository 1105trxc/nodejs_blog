var path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');

const sortMiddleware = require('./app/middlewares/sortMiddleware');

const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

//Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

//Băm mật khẩu
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(methodOverride('_method'));

//Session middleware
app.use(
  session({
    secret: 'a-very-strong-secret-key', // Thay thế bằng một chuỗi bí mật ngẫu nhiên và mạnh
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Đặt là true nếu bạn dùng HTTPS
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user; // Truyền thông tin user từ session vào res.locals
  next();
});

//Custom middlewares
app.use(sortMiddleware);

//HTTP logger
// app.use(morgan('combined'))

//Template engine
app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      sortable: (field, sort) => {
        const isCurrentSortColumn = sort.column === field;
        const nextSortType = isCurrentSortColumn ? sort.type : 'default';
        const icons = {
          default: 'bi bi-funnel',
          asc: 'bi bi-sort-down-alt',
          desc: 'bi bi-sort-down',
        };

        const types = {
          default: 'asc',
          asc: 'desc',
          desc: 'asc',
        };

        const type = types[nextSortType];
        const icon = icons[nextSortType];

        const href = `?_sort&column=${field}&type=${type}`;

        return `
            <a href="${href}">
                <i class="${icon}"></i>
            </a>
        `;
      },
      if_eq: function (a, b, opts) {
        if (a === b) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      },
    },
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
